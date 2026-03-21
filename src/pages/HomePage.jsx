import { useState, useEffect } from "react";
import { fetchEvents, fetchEventMatches } from "../lib/api";

const DEFAULT_EVENT_NAME = "2026 CA District Los Angeles Event";
const DEFAULT_EVENT_CITY = "El Segundo";
const DEFAULT_EVENT_LABEL = `${DEFAULT_EVENT_NAME} (${DEFAULT_EVENT_CITY})`;

function HomePage({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(localStorage.getItem("selectedEvent") || "");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const hasApiKey = !!import.meta.env.VITE_TBA_API_KEY;

  async function loadEvents(year = 2026) {
    try {
      setLoading(true);
      setError("");
      
      if (!hasApiKey) {
        throw new Error("API Key (VITE_TBA_API_KEY) is missing in Netlify settings. Ensure you re-deployed after adding it.");
      }

      const data = await fetchEvents(year);
      
      if (!data || data.length === 0) {
        if (year === 2026) {
          console.log("No 2026 events, trying 2025...");
          loadEvents(2025); // Fallback to 2025 to test connection
        } else {
          setError(`No events found for ${year}.`);
        }
      } else {
        setEvents(data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date)));
      }
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (events.length === 0 && !error) loadEvents();
  }, []);

  function findDefaultEvent(eventList) {
    return eventList.find(
      (event) => event.name === DEFAULT_EVENT_NAME && event.city === DEFAULT_EVENT_CITY
    );
  }

  async function syncSelectedEvent(key) {
    setSelectedEvent(key);
    if (!key) {
      localStorage.removeItem("selectedEvent");
      localStorage.removeItem("matchSchedule");
      return;
    }

    setStatus("Fetching schedule...");
    try {
      const matches = await fetchEventMatches(key);
      localStorage.setItem("selectedEvent", key);
      localStorage.setItem("matchSchedule", JSON.stringify(matches));
      setStatus("Schedule synced!");
    } catch (err) {
      setStatus("Error fetching schedule");
    }
  }

  useEffect(() => {
    if (events.length === 0) return;

    const defaultEvent = findDefaultEvent(events);
    if (!defaultEvent) {
      setError(`Could not find ${DEFAULT_EVENT_LABEL}.`);
      return;
    }

    if (selectedEvent !== defaultEvent.key) {
      syncSelectedEvent(defaultEvent.key);
    }
  }, [events, selectedEvent]);

  return (
    <section className="home-page" style={{ display: 'grid', gap: '2rem' }}>
      <div className="form" style={{ padding: '1.2rem' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>📍 Competition Context</h3>
        
        <label>
          Active Event
          <input value={loading && !selectedEvent ? "Loading event..." : DEFAULT_EVENT_LABEL} readOnly style={{ opacity: 0.9 }} />
        </label>

        {error && (
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#ff4d4d' }}>⚠️ {error}</p>
            <button 
              className="primary-button" 
              style={{ padding: '0.5rem', fontSize: '0.8rem' }} 
              onClick={() => loadEvents()}
            >
              Retry Load
            </button>
          </div>
        )}
        
        {status && <p style={{ fontSize: '0.8rem', color: 'var(--accent)', margin: '0.5rem 0 0' }}>{status}</p>}
      </div>

      <div className="card-grid">
        <button type="button" className="feature-card" onClick={() => onNavigate("pit")}>
          <h3>Pit Scouting</h3>
          <p>Capture robot specs & photos.</p>
        </button>
        <button type="button" className="feature-card" onClick={() => onNavigate("match")}>
          <h3>Match Scouting</h3>
          <p>Real-time match performance tracking.</p>
        </button>
        <button type="button" className="feature-card" onClick={() => onNavigate("rankings")}>
          <h3>Rankings</h3>
          <p>Aggregated team stats and pick lists.</p>
        </button>
      </div>
    </section>
  );
}

export default HomePage;
