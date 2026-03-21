async function callTBA(path) {
  // Call our own Netlify Function proxy instead of TBA directly
  const response = await fetch(`/api/tba-proxy?path=${encodeURIComponent(path)}`);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "TBA Proxy Request failed");
  }
  return response.json();
}

export function fetchEvents(year = 2026) {
  return callTBA(`/events/${year}/simple`);
}

export function fetchEventMatches(eventKey) {
  return callTBA(`/event/${eventKey}/matches/simple`);
}

async function callApi(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function submitPitScout(payload) {
  const scoringMechanisms = `${payload.shooterCount || "1"} shooter${payload.shooterCount === "1" ? "" : "s"}, Turret: ${payload.turret || "No"}`;

  return callApi("/api/sheets-write", {
    sheetName: "PitScouting",
    row: [
      new Date().toISOString(),
      payload.scout,
      payload.team,
      payload.driveTrain,
      payload.canCrossBumps,
      payload.canUnderTrench,
      payload.intakeType,
      scoringMechanisms,
      payload.climbLevel,
      payload.autoSummary,
      payload.teleopSummary,
      payload.reliability,
      payload.comments,
      payload.maxBallsInHopper,
      payload.cycleTimeSec
    ]
  });
}

export function submitMatchScout(payload) {
  return callApi("/api/sheets-write", {
    sheetName: "MatchScouting",
    row: [
      new Date().toISOString(),
      payload.scout,
      payload.matchNumber,
      payload.alliance,
      payload.team,
      payload.station,
      payload.autoFuelScored,
      payload.autoFuelMissed,
      payload.leftStartingZone,
      payload.autoTowerLevel1,
      payload.startingPosition,
      payload.autoPathType,
      payload.teleopFuelScored,
      payload.teleopFuelMissed,
      payload.teleopTowerLevel,
      payload.avgCycleTimeSec,
      payload.dropsFumbles,
      payload.preferredScoringLocation,
      payload.fieldAwareness,
      payload.driverStationComms,
      payload.playedDefense,
      payload.defenseTimeSec,
      payload.defenseEffectiveness,
      payload.scoredWhileDefended,
      payload.pushedEasily,
      payload.drewFouls,
      payload.robotSpeed,
      payload.breakdown,
      payload.deadRobot,
      payload.brownout,
      payload.noShow,
      payload.dq,
      payload.repairTimeMin,
      payload.reliabilityScore,
      payload.reliability,
      payload.generalComments
    ]
  });
}

export function loadRankings() {
  return callApi("/api/sheets-read", {
    sheetName: "Rankings"
  });
}

export function loadMatchScoutingRows() {
  return callApi("/api/sheets-read", {
    sheetName: "MatchScouting"
  });
}
