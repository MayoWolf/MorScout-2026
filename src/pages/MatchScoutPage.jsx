import { useState, useEffect } from "react";
import { submitMatchScout } from "../lib/api";

const initialState = {
  scout: "",
  matchNumber: "",
  alliance: "Red",
  team: "",
  station: "1",
  autoFuelScored: 0,
  autoFuelAttempted: 0,
  leftStartingZone: "No",
  startingPosition: "Center",
  autoPathType: "Center",
  autoTowerLevel1: "No",
  teleopFuelScored: 0,
  teleopFuelAttempted: 0,
  teleopTowerLevel: "None",
  avgCycleTimeSec: 0,
  dropsFumbles: 0,
  preferredScoringLocation: "Mixed",
  fieldAwareness: "3",
  driverStationComms: "3",
  playedDefense: "No",
  defenseTimeSec: 0,
  defenseEffectiveness: "1",
  scoredWhileDefended: "Yes",
  pushedEasily: "No",
  drewFouls: "No",
  robotSpeed: "Medium",
  breakdown: "No",
  deadRobot: "No",
  brownout: "No",
  noShow: "No",
  dq: "No",
  repairTimeMin: 0,
  reliabilityScore: "5",
  reliability: "No issues",
  generalComments: ""
};

const scorePairs = [
  ["autoFuelScored", "autoFuelAttempted", "Auto FUEL"],
  ["teleopFuelScored", "teleopFuelAttempted", "Teleop FUEL"]
];

function MatchScoutPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");
  const [view, setView] = useState("list"); // "list" or "form"
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const scheduleRaw = localStorage.getItem("matchSchedule");
    if (scheduleRaw) {
      try {
        const data = JSON.parse(scheduleRaw);
        setMatches(data.filter(m => m.comp_level === "qm").sort((a, b) => a.match_number - b.match_number));
      } catch (e) {
        console.error("Schedule parse error", e);
      }
    }
  }, []);

  function startScouting(matchNum, alliance, station, teamNum) {
    setForm({
      ...initialState,
      matchNumber: matchNum,
      alliance: alliance,
      station: station,
      team: teamNum.replace("frc", "")
    });
    setView("form");
    window.scrollTo(0, 0);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateNumber(name, delta) {
    setForm((prev) => {
      const current = Number(prev[name]) || 0;
      return { ...prev, [name]: Math.max(0, current + delta) };
    });
  }

  function updateDirectNumber(event) {
    const { name, value } = event.target;
    const num = Math.max(0, Number(value) || 0);
    setForm((prev) => ({ ...prev, [name]: num }));
  }

  async function onSubmit(event) {
    event.preventDefault();

    for (const [scoredKey, attemptedKey, label] of scorePairs) {
      if (Number(form[scoredKey]) > Number(form[attemptedKey])) {
        setStatus(`${label}: scored cannot exceed attempted.`);
        return;
      }
    }

    setStatus("Saving...");

    try {
      await submitMatchScout(form);
      setStatus("Saved to Google Sheets.");
      // Small delay then back to list
      setTimeout(() => {
        setView("list");
        setStatus("");
        setForm(initialState);
      }, 1500);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (view === "list") {
    return (
      <div className="match-list-view">
        <h2 style={{ marginBottom: '1.5rem' }}>Select Match</h2>
        {matches.length === 0 ? (
          <div className="form" style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <p>No schedule found. Select an event on the Home page first.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {matches.map(m => (
              <div key={m.key} className="match-card">
                <div className="match-num">QM {m.match_number}</div>
                <div className="alliance-group red">
                  {m.alliances.red.team_keys.map((team, i) => (
                    <button key={team} onClick={() => startScouting(m.match_number, "Red", String(i + 1), team)}>
                      {team.replace("frc", "")}
                    </button>
                  ))}
                </div>
                <div className="alliance-group blue">
                  {m.alliances.blue.team_keys.map((team, i) => (
                    <button key={team} onClick={() => startScouting(m.match_number, "Blue", String(i + 1), team)}>
                      {team.replace("frc", "")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Match Scout - REBUILT</h2>
        <button type="button" className="nav-item" style={{ background: 'var(--glass-bright)', padding: '0.5rem 1rem' }} onClick={() => setView("list")}>
          ✕ Cancel
        </button>
      </div>

      <div className="inline-grid">
        <label>
          Scout Name
          <input name="scout" value={form.scout} onChange={updateField} required />
        </label>

        <label>
          Match Number
          <input name="matchNumber" value={form.matchNumber} readOnly style={{ opacity: 0.7 }} />
        </label>

        <label>
          Team Number
          <input name="team" value={form.team} readOnly style={{ opacity: 0.7 }} />
        </label>

        <label>
          Alliance
          <input name="alliance" value={form.alliance} readOnly style={{ opacity: 0.7 }} />
        </label>

        <label>
          Station
          <input name="station" value={form.station} readOnly style={{ opacity: 0.7 }} />
        </label>
      </div>

      <section className="counter-panel">
        <h3>Auto Period</h3>
        <h4>Scoring Elements (FUEL)</h4>
        <CounterPair label="FUEL" scored={form.autoFuelScored} attempted={form.autoFuelAttempted} onMinusScored={() => updateNumber("autoFuelScored", -1)} onPlusScored={() => updateNumber("autoFuelScored", 1)} onMinusAttempted={() => updateNumber("autoFuelAttempted", -1)} onPlusAttempted={() => updateNumber("autoFuelAttempted", 1)} />

        <div className="inline-grid">
          <label>
            Left Starting Zone?
            <select name="leftStartingZone" value={form.leftStartingZone} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            TOWER Level 1?
            <select name="autoTowerLevel1" value={form.autoTowerLevel1} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Starting Position
            <select name="startingPosition" value={form.startingPosition} onChange={updateField}>
              <option>Left</option>
              <option>Center</option>
              <option>Right</option>
            </select>
          </label>

          <label>
            Auto Path Type
            <select name="autoPathType" value={form.autoPathType} onChange={updateField}>
              <option>Standard</option>
              <option>Custom</option>
              <option>None</option>
            </select>
          </label>
        </div>
      </section>

      <section className="counter-panel">
        <h3>Teleop Period</h3>
        <h4>Scoring Elements (FUEL)</h4>
        <CounterPair label="FUEL" scored={form.teleopFuelScored} attempted={form.teleopFuelAttempted} onMinusScored={() => updateNumber("teleopFuelScored", -1)} onPlusScored={() => updateNumber("teleopFuelScored", 1)} onMinusAttempted={() => updateNumber("teleopFuelAttempted", -1)} onPlusAttempted={() => updateNumber("teleopFuelAttempted", 1)} />

        <div className="inline-grid">
          <label>
            Avg Cycle Time (sec)
            <input type="number" min="0" name="avgCycleTimeSec" value={form.avgCycleTimeSec} onChange={updateDirectNumber} />
          </label>

          <label>
            Drops/Fumbles
            <input type="number" min="0" name="dropsFumbles" value={form.dropsFumbles} onChange={updateDirectNumber} />
          </label>

          <label>
            Preferred Scoring
            <select name="preferredScoringLocation" value={form.preferredScoringLocation} onChange={updateField}>
              <option>High HUB</option>
              <option>Low HUB</option>
              <option>Mixed</option>
            </select>
          </label>
        </div>
      </section>

      <section className="counter-panel">
        <h3>Endgame + Defense</h3>
        <div className="inline-grid">
          <label>
            TOWER Level
            <select name="teleopTowerLevel" value={form.teleopTowerLevel} onChange={updateField}>
              <option>None</option>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
            </select>
          </label>

          <label>
            Field Awareness (1-5)
            <select name="fieldAwareness" value={form.fieldAwareness} onChange={updateField}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </label>

          <label>
            Played Defense?
            <select name="playedDefense" value={form.playedDefense} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Defense Effectiveness (1-5)
            <select name="defenseEffectiveness" value={form.defenseEffectiveness} onChange={updateField}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </label>

          <label>
            Robot Speed
            <select name="robotSpeed" value={form.robotSpeed} onChange={updateField}>
              <option>Slow</option>
              <option>Medium</option>
              <option>Fast</option>
            </select>
          </label>
        </div>
      </section>

      <section className="counter-panel">
        <h3>Reliability</h3>
        <div className="inline-grid">
          <label>
            Broke Down?
            <select name="breakdown" value={form.breakdown} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Did Not Move?
            <select name="deadRobot" value={form.deadRobot} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Reliability Score (0-5)
            <select name="reliabilityScore" value={form.reliabilityScore} onChange={updateField}>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </label>

          <label>
            Reliability Tag
            <select name="reliability" value={form.reliability} onChange={updateField}>
              <option>No issues</option>
              <option>Minor issue</option>
              <option>Major issue</option>
              <option>Dead robot</option>
            </select>
          </label>
        </div>

        <label>
          General Comments
          <textarea name="generalComments" value={form.generalComments} onChange={updateField} rows="4" />
        </label>
      </section>

      <button className="primary-button" type="submit">
        Save Match Report
      </button>
      {status && <p className="status">{status}</p>}
    </form>
  );
}

function Counter({ value, onMinus, onPlus }) {
  return (
    <div className="counter-row">
      <button type="button" onClick={onMinus}>-</button>
      <strong>{value}</strong>
      <button type="button" onClick={onPlus}>+</button>
    </div>
  );
}

function CounterPair({
  label,
  scored,
  attempted,
  onMinusScored,
  onPlusScored,
  onMinusAttempted,
  onPlusAttempted
}) {
  return (
    <div className="counter-pair">
      <p>{label}</p>
      <div>
        <span>Scored</span>
        <Counter value={scored} onMinus={onMinusScored} onPlus={onPlusScored} />
      </div>
      <div>
        <span>Attempted</span>
        <Counter value={attempted} onMinus={onMinusAttempted} onPlus={onPlusAttempted} />
      </div>
    </div>
  );
}

export default MatchScoutPage;
