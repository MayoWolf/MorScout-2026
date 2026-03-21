import { useState } from "react";
import { submitPitScout } from "../lib/api";

const initialState = {
  scout: "",
  team: "",
  driveTrain: "",
  canCrossBumps: "No",
  canUnderTrench: "No",
  intakeType: "None",
  shooterCount: "1",
  turret: "No",
  climbLevel: "None",
  autoSummary: "",
  teleopSummary: "",
  reliability: "",
  comments: ""
};

function PitScoutPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setStatus("Saving...");

    try {
      await submitPitScout(form);
      setStatus("Saved to Google Sheets.");
      setForm(initialState);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>Pit Scout - REBUILT 2026</h2>

      <div className="inline-grid">
        <label>
          Scout Name
          <input name="scout" value={form.scout} onChange={updateField} required />
        </label>

        <label>
          Team Number
          <input name="team" value={form.team} onChange={updateField} required />
        </label>

        <label>
          Drivetrain
          <select name="driveTrain" value={form.driveTrain} onChange={updateField}>
            <option value="">Select</option>
            <option value="Swerve">Swerve</option>
            <option value="Tank">Tank</option>
            <option value="Mecanum">Mecanum</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Can Cross BUMPS?
          <select name="canCrossBumps" value={form.canCrossBumps} onChange={updateField}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>

        <label>
          Fits Under TRENCH? (&lt;22.25in)
          <select name="canUnderTrench" value={form.canUnderTrench} onChange={updateField}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>

        <label>
          Intake Type
          <select name="intakeType" value={form.intakeType} onChange={updateField}>
            <option value="None">None</option>
            <option value="Ground">Ground</option>
            <option value="Human Player">Human Player</option>
            <option value="Both">Both</option>
          </select>
        </label>

        <label>
          Target Climb Level
          <select name="climbLevel" value={form.climbLevel} onChange={updateField}>
            <option value="None">None</option>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>
        </label>
      </div>

      <div className="inline-grid">
        <label>
          How Many Shooters
          <select name="shooterCount" value={form.shooterCount} onChange={updateField}>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </label>

        <label>
          Turret
          <select name="turret" value={form.turret} onChange={updateField}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
      </div>

      <label>
        Auto Capabilities
        <textarea name="autoSummary" value={form.autoSummary} onChange={updateField} rows="3" placeholder="Paths, scoring, TOWER level 1..." />
      </label>

      <label>
        Teleop Capabilities
        <textarea name="teleopSummary" value={form.teleopSummary} onChange={updateField} rows="3" placeholder="Cycle speed, defense, etc." />
      </label>

      <label>
        Reliability
        <select name="reliability" value={form.reliability} onChange={updateField}>
          <option value="">Select</option>
          <option value="No issues">No issues</option>
          <option value="Minor issue">Minor issue</option>
          <option value="Major issue">Major issue</option>
        </select>
      </label>

      <label>
        Comments
        <textarea name="comments" value={form.comments} onChange={updateField} rows="4" />
      </label>

      <button className="primary-button" type="submit">Save Pit Report</button>
      {status && <p className="status">{status}</p>}
    </form>
  );
}

export default PitScoutPage;
