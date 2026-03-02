# MorScout 2026

MorTorq FRC scouting app built with React and deployed on Netlify.

## Stack

- React + Vite frontend
- Netlify Functions API
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
- `Rankings` (optional if you only use computed rankings page)

4. Share the sheet with your Google service account email (Editor).

5. Run locally:

```bash
npm run dev
```

## Netlify deploy

1. Push this repo to GitHub (public).
2. In Netlify, import the GitHub repo.
3. Build settings are already defined in `netlify.toml`.
4. Add environment variables in Netlify site settings:
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

## Data columns

### PitScouting
- Timestamp
- Scout
- Team
- Drivetrain
- AutoSummary
- TeleopSummary
- Endgame
- Reliability
- Comments

### MatchScouting
- Timestamp
- Scout
- MatchNumber
- Alliance
- Team
- Station
- AutoCoralL1Scored
- AutoCoralL1Attempted
- AutoCoralL2Scored
- AutoCoralL2Attempted
- AutoCoralL3Scored
- AutoCoralL3Attempted
- AutoCoralL4Scored
- AutoCoralL4Attempted
- LeftStartingZone
- StartingPosition
- AutoPathType
- AutoInterference
- AutoMultiPiece
- TeleopCoralL1Scored
- TeleopCoralL1Attempted
- TeleopCoralL2Scored
- TeleopCoralL2Attempted
- TeleopCoralL3Scored
- TeleopCoralL3Attempted
- TeleopCoralL4Scored
- TeleopCoralL4Attempted
- AvgCycleTimeSec
- DropsFumbles
- PreferredScoringLocation
- FieldAwareness
- AdaptsWhenGoalsDeactivate
- DriverStationComms
- PartnerCollisions
- PlayedDefense
- DefenseTimeSec
- DefenseEffectiveness
- ScoredWhileDefended
- PushedEasily
- DrewFouls
- ClimbLevelAttempted
- ClimbSuccess
- ClimbAttemptTiming
- ClimbTimeSec
- ClimbFailure
- ClimbComments
- RobotSpeed
- Breakdown
- DeadRobot
- Brownout
- NoShow
- DQ
- RepairTimeMin
- ReliabilityScore
- Reliability
- GeneralComments
