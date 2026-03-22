import { useEffect, useMemo, useState } from "react";
import { loadMatchScoutingRows } from "../lib/api";

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function buildHeaderMap(headerRow) {
  return headerRow.reduce((map, header, index) => {
    map[normalizeHeader(header)] = index;
    return map;
  }, {});
}

function getIndex(headerMap, aliases) {
  for (const alias of aliases) {
    if (headerMap[alias] !== undefined) {
      return headerMap[alias];
    }
  }

  return -1;
}

function getCell(row, index) {
  return index >= 0 ? row[index] : "";
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildRankings(rawRows) {
  if (!rawRows || rawRows.length === 0) {
    return {
      rows: [],
      totalEntries: 0,
      totalTeams: 0,
      missingColumns: []
    };
  }

  const [headerRow, ...dataRows] = rawRows;
  const headerMap = buildHeaderMap(headerRow);

  const columns = {
    team: getIndex(headerMap, ["teamnumber", "team"]),
    matchNumber: getIndex(headerMap, ["matchnumber"]),
    autoFuelScored: getIndex(headerMap, ["autofuelscored"]),
    autoTowerLevel1: getIndex(headerMap, ["autotowerlevel1"]),
    teleopFuelScored: getIndex(headerMap, ["teleopfuelscored"]),
    teleopTowerLevel: getIndex(headerMap, ["teleoptowerlevel"]),
    fieldAwareness: getIndex(headerMap, ["fieldawareness15", "fieldawareness"]),
    playedDefense: getIndex(headerMap, ["playeddefense"]),
    defenseEffectiveness: getIndex(headerMap, ["defenseeffectiveness"]),
    reliabilityScore: getIndex(headerMap, ["reliabilityscore05", "reliabilityscore"])
  };

  const missingColumns = Object.entries(columns)
    .filter(([, index]) => index < 0)
    .map(([name]) => name);

  const bucket = new Map();

  dataRows.forEach((row) => {
    const team = String(getCell(row, columns.team)).trim();
    if (!/^\d+$/.test(team)) {
      return;
    }

    if (!bucket.has(team)) {
      bucket.set(team, {
        matches: 0,
        autoTotal: 0,
        teleTotal: 0,
        endgameSuccesses: 0,
        reliabilityTotal: 0,
        awarenessTotal: 0,
        defenseTotal: 0,
        matchTotals: []
      });
    }

    const item = bucket.get(team);
    const autoFuel = num(getCell(row, columns.autoFuelScored));
    const teleFuel = num(getCell(row, columns.teleopFuelScored));
    const towerLevel = String(getCell(row, columns.teleopTowerLevel)).toLowerCase();
    const autoTower = String(getCell(row, columns.autoTowerLevel1)).toLowerCase() === "yes" ? 15 : 0;

    let endgamePoints = 0;
    if (towerLevel === "level 1") endgamePoints = 10;
    else if (towerLevel === "level 2") endgamePoints = 20;
    else if (towerLevel === "level 3") endgamePoints = 30;

    const autoPoints = autoFuel + autoTower;
    const telePoints = teleFuel + endgamePoints;
    const totalPoints = autoPoints + telePoints;
    const matchNumber = num(getCell(row, columns.matchNumber));
    const playedDefense = String(getCell(row, columns.playedDefense)).toLowerCase() === "yes";

    item.matches += 1;
    item.autoTotal += autoPoints;
    item.teleTotal += telePoints;
    item.endgameSuccesses += endgamePoints > 0 ? 1 : 0;
    item.reliabilityTotal += num(getCell(row, columns.reliabilityScore));
    item.awarenessTotal += num(getCell(row, columns.fieldAwareness));
    item.defenseTotal += playedDefense ? num(getCell(row, columns.defenseEffectiveness)) : 0;
    item.matchTotals.push({ matchNumber, totalPoints });
  });

  const rows = Array.from(bucket.entries())
    .map(([team, item]) => {
      const sortedTotals = item.matchTotals
        .slice()
        .sort((left, right) => left.matchNumber - right.matchNumber)
        .slice(-5);
      const last5 =
        sortedTotals.reduce((sum, match) => sum + match.totalPoints, 0) /
        Math.max(sortedTotals.length, 1);

      const avgAuto = item.autoTotal / item.matches;
      const avgTele = item.teleTotal / item.matches;
      const endgamePct = (item.endgameSuccesses / item.matches) * 100;
      const reliability = item.reliabilityTotal / item.matches;
      const awareness = item.awarenessTotal / item.matches;
      const defense = item.defenseTotal / item.matches;
      const pickScore =
        avgAuto * 2.0 +
        avgTele * 1.5 +
        reliability * 2.5 +
        awareness * 1.0 +
        defense * 0.8 +
        (endgamePct / 100) * 3.0;

      return {
        team,
        matches: item.matches,
        avgAuto,
        avgTele,
        endgamePct,
        reliability,
        awareness,
        defense,
        last5,
        pickScore
      };
    })
    .sort((left, right) => right.pickScore - left.pickScore);

  return {
    rows,
    totalEntries: dataRows.length,
    totalTeams: rows.length,
    missingColumns
  };
}

function fmt(value, digits = 1) {
  return Number(value).toFixed(digits);
}

function SummaryCard({ label, value, hint }) {
  return (
    <div className="counter-panel" style={{ gap: "0.25rem" }}>
      <span style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase" }}>
        {label}
      </span>
      <strong style={{ fontSize: "1.5rem", color: "var(--text)" }}>{value}</strong>
      {hint ? <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{hint}</span> : null}
    </div>
  );
}

function RankingsPage() {
  const [rawRows, setRawRows] = useState([]);
  const [status, setStatus] = useState("Loading match scouting data...");

  const rankings = useMemo(() => buildRankings(rawRows), [rawRows]);

  async function onRefresh() {
    setStatus("Loading match scouting data...");

    try {
      const data = await loadMatchScoutingRows();
      setRawRows(data.rows || []);
      setStatus("Rankings updated from Google Sheets.");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <section className="form">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h2>Rankings</h2>
          <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
            Pulled live from the <code>MatchScouting</code> sheet.
          </p>
        </div>
        <button className="primary-button" type="button" onClick={onRefresh}>
          Refresh Rankings
        </button>
      </div>

      <div className="inline-grid">
        <SummaryCard label="Teams" value={rankings.totalTeams} hint="Unique teams ranked" />
        <SummaryCard label="Entries" value={rankings.totalEntries} hint="Scouted rows processed" />
        <SummaryCard
          label="Status"
          value={status.startsWith("Error:") ? "Issue" : "Live"}
          hint={status}
        />
      </div>

      {rankings.missingColumns.length > 0 && (
        <div className="counter-panel">
          <h3>Sheet Mapping Warning</h3>
          <p className="status">
            Missing expected columns: {rankings.missingColumns.join(", ")}.
          </p>
        </div>
      )}

      {rankings.rows.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Matches</th>
                <th>Avg Auto</th>
                <th>Avg Tele</th>
                <th>Endgame %</th>
                <th>Reliability</th>
                <th>Awareness</th>
                <th>Defense</th>
                <th>Last 5</th>
                <th>Pick Score</th>
              </tr>
            </thead>
            <tbody>
              {rankings.rows.map((row, index) => (
                <tr key={row.team}>
                  <td>{index + 1}</td>
                  <td>#{row.team}</td>
                  <td>{row.matches}</td>
                  <td>{fmt(row.avgAuto)}</td>
                  <td>{fmt(row.avgTele)}</td>
                  <td>{fmt(row.endgamePct, 0)}%</td>
                  <td>{fmt(row.reliability)}</td>
                  <td>{fmt(row.awareness)}</td>
                  <td>{fmt(row.defense)}</td>
                  <td>{fmt(row.last5)}</td>
                  <td>{fmt(row.pickScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="counter-panel">
          <h3>No Ranking Data Yet</h3>
          <p className="status">
            Once the MatchScouting sheet has rows, rankings will populate here automatically.
          </p>
        </div>
      )}
    </section>
  );
}

export default RankingsPage;
