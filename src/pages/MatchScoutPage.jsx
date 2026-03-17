import { useState, useEffect } from "react";
import { submitMatchScout } from "../lib/api";

const initialState = {
  scout: "",
  matchNumber: "",
  alliance: "Red",
  team: "",
  station: "1",
  autoFuelScored: 0,
  autoFuelMissed: 0,
  leftStartingZone: "No",
  startingPosition: "Center",
  autoPathType: "Fuel",
  autoTowerLevel1: "No",
  teleopFuelScored: 0,
  teleopFuelMissed: 0,
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

  function setCounterValue(name, value) {
    const num = Math.max(0, Number(value) || 0);
    setForm((prev) => ({ ...prev, [name]: num }));
  }

  function updateDirectNumber(event) {
    const { name, value } = event.target;
    const num = Math.max(0, Number(value) || 0);
    setForm((prev) => ({ ...prev, [name]: num }));
  }

  async function onSubmit(event) {
    event.preventDefault();

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
        <h3>AUTO</h3>
        <h4>Scoring in the active HUB (FUEL)</h4>
        <CounterPair label="FUEL" scoredName="autoFuelScored" scored={form.autoFuelScored} missedName="autoFuelMissed" missed={form.autoFuelMissed} updateNumber={updateNumber} setCounterValue={setCounterValue} onMinusScored={() => updateNumber("autoFuelScored", -1)} onPlusScored={() => updateNumber("autoFuelScored", 1)} onMinusMissed={() => updateNumber("autoFuelMissed", -1)} onPlusMissed={() => updateNumber("autoFuelMissed", 1)} />

        <div className="inline-grid">
          <label>
            Left ROBOT STARTING LINE?
            <select name="leftStartingZone" value={form.leftStartingZone} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Reached TOWER LEVEL 1?
            <select name="autoTowerLevel1" value={form.autoTowerLevel1} onChange={updateField}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Starting Position on Line
            <select name="startingPosition" value={form.startingPosition} onChange={updateField}>
              <option>Left</option>
              <option>Center</option>
              <option>Right</option>
            </select>
          </label>

          <label>
            AUTO Objective
            <select name="autoPathType" value={form.autoPathType} onChange={updateField}>
              <option>Fuel</option>
              <option>Tower</option>
              <option>Both</option>
              <option>None</option>
            </select>
          </label>
        </div>
      </section>

      <section className="counter-panel">
        <h3>TELEOP</h3>
        <h4>Count FUEL scored while the HUB is active</h4>
        <CounterPair label="FUEL" scoredName="teleopFuelScored" scored={form.teleopFuelScored} missedName="teleopFuelMissed" missed={form.teleopFuelMissed} updateNumber={updateNumber} setCounterValue={setCounterValue} onMinusScored={() => updateNumber("teleopFuelScored", -1)} onPlusScored={() => updateNumber("teleopFuelScored", 1)} onMinusMissed={() => updateNumber("teleopFuelMissed", -1)} onPlusMissed={() => updateNumber("teleopFuelMissed", 1)} />

        <div className="inline-grid">
          <label>
            Avg Cycle Time (sec)
            <input type="number" min="0" name="avgCycleTimeSec" value={form.avgCycleTimeSec} onChange={updateDirectNumber} />
          </label>

          <label>
            Drops/Fumbles
            <input type="number" min="0" name="dropsFumbles" value={form.dropsFumbles} onChange={updateDirectNumber} />
          </label>

        </div>
      </section>

      <section className="counter-panel">
        <h3>END GAME + Defense</h3>
        <div className="inline-grid">
          <label>
            Final TOWER LEVEL
            <select name="teleopTowerLevel" value={form.teleopTowerLevel} onChange={updateField}>
              <option>None</option>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
            </select>
          </label>

          <label>
            SHIFT / HUB Awareness (1-5)
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

function Counter({ value, onMinusTen, onMinus, onChange, onPlus, onPlusTen }) {
  return (
    <div className="counter-row">
      <button type="button" onClick={onMinusTen}>-10</button>
      <button type="button" onClick={onMinus}>-</button>
      <input
        className="counter-input"
        type="number"
        min="0"
        inputMode="numeric"
        value={value}
        onChange={onChange}
      />
      <button type="button" onClick={onPlus}>+</button>
      <button type="button" onClick={onPlusTen}>+10</button>
    </div>
  );
}

function CounterPair({
  label,
  scoredName,
  scored,
  missedName,
  missed,
  updateNumber,
  setCounterValue,
  onMinusScored,
  onPlusScored,
  onMinusMissed,
  onPlusMissed
}) {
  return (
    <div className="counter-pair">
      <p>{label}</p>
      <div>
        <span>
          Scored <span style={{ opacity: 0.55 }}>(Approx)</span>
        </span>
        <Counter
          value={scored}
          onMinusTen={() => updateNumber(scoredName, -10)}
          onMinus={onMinusScored}
          onChange={(event) => setCounterValue(scoredName, event.target.value)}
          onPlus={onPlusScored}
          onPlusTen={() => updateNumber(scoredName, 10)}
        />
      </div>
      <div>
        <span>
          Missed <span style={{ opacity: 0.55 }}>(Approx)</span>
        </span>
        <Counter
          value={missed}
          onMinusTen={() => updateNumber(missedName, -10)}
          onMinus={onMinusMissed}
          onChange={(event) => setCounterValue(missedName, event.target.value)}
          onPlus={onPlusMissed}
          onPlusTen={() => updateNumber(missedName, 10)}
        />
      </div>
    </div>
  );
}

export default MatchScoutPage;
