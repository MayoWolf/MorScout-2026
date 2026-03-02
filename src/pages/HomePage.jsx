import { useState, useEffect } from "react";
import { fetchEvents, fetchEventMatches } from "../lib/api";

function HomePage({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(localStorage.getItem("selectedEvent") || "");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchEvents(2026);
        if (!data || data.length === 0) {
          setError("No events found for 2026.");
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
    if (events.length === 0) loadEvents();
  }, []);

  async function onSelectEvent(e) {
    const key = e.target.value;
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

  return (
    <section className="home-page" style={{ display: 'grid', gap: '2rem' }}>
      <div className="form" style={{ padding: '1.2rem' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>📍 Competition Context</h3>
        <label>
          Select Event
          <select value={selectedEvent} onChange={onSelectEvent} disabled={loading}>
            <option value="">{loading ? "Loading Events..." : "-- Choose Event --"}</option>
            {events.map(ev => (
              <option key={ev.key} value={ev.key}>
                {ev.name} ({ev.city})
              </option>
            ))}
          </select>
        </label>
        {error && <p style={{ fontSize: '0.8rem', color: '#ff4d4d', margin: '0.5rem 0 0' }}>⚠️ {error}</p>}
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
