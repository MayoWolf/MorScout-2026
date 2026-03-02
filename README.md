# MorScout 2026

MorTorq FRC scouting app built with React and deployed on Netlify.

## Stack

- React + Vite frontend
- Netlify Functions (Google Sheets API)
- Google Sheets as data storage

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill values.

3. Create these sheet tabs in your Google Sheet:
- `PitScouting`
- `MatchScouting`

4. Share the sheet with your Google service account email as **Editor**.

5. Run locally:

```bash
npm run dev
```

> Note: To test the API functions locally, you may need the [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed. Run `netlify dev` instead of `npm run dev` to start both the frontend and the local functions server.

## Google Sheets setup

Detailed instructions for setting up the Google Sheet and Service Account can be found in [SETUP_GOOGLE_SHEETS.md](./SETUP_GOOGLE_SHEETS.md).

## Data columns

Ensure your Google Sheet tabs have these exact columns in row 1:

### PitScouting
1. Timestamp
2. Scout
3. Team
4. Drivetrain
5. CanCrossBumps
6. CanUnderTrench
7. IntakeType
8. ScoringMechanisms
9. ClimbLevel
10. AutoSummary
11. TeleopSummary
12. Reliability
13. Comments

### MatchScouting
1. Timestamp
2. Scout
3. MatchNumber
4. Alliance
5. Team
6. Station
7. AutoFuelScored
8. AutoFuelAttempted
9. LeftStartingZone
10. AutoTowerLevel1
11. StartingPosition
12. AutoPathType
13. TeleopFuelScored
14. TeleopFuelAttempted
15. TeleopTowerLevel
16. AvgCycleTimeSec
17. DropsFumbles
18. PreferredScoringLocation
19. FieldAwareness
20. DriverStationComms
21. PlayedDefense
22. DefenseTimeSec
23. DefenseEffectiveness
24. ScoredWhileDefended
25. PushedEasily
26. DrewFouls
27. RobotSpeed
28. Breakdown
29. DeadRobot
30. Brownout
31. NoShow
32. DQ
33. RepairTimeMin
34. ReliabilityScore
35. Reliability
36. GeneralComments
