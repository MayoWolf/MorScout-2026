# Google Sheets Setup (MorScout 2026)

## 1. Create spreadsheet

Create a Google Sheet and add these tabs:
- `PitScouting`
- `MatchScouting`

Add header rows in row 1 with the exact column names specified in the README.

## 2. Create service account

1. Open Google Cloud Console.
2. Create a project (or use existing).
3. Enable **Google Sheets API**.
4. Create a **Service Account**.
5. Create a JSON key for that service account.

From the key JSON, keep:
- `client_email` -> `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` -> `GOOGLE_PRIVATE_KEY`

## 3. Share sheet with service account

In Google Sheets, click Share and add the service account email as **Editor**.

## 4. Get spreadsheet ID

From the sheet URL:

`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`

Use `<SHEET_ID>` as `GOOGLE_SHEETS_ID`.

## 5. Configure Netlify environment variables

In Netlify site settings, add:
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

For private key, keep line breaks escaped with `\\n` when pasting.

## 6. Optional local `.env`

Create `.env` in project root:

```env
GOOGLE_SHEETS_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```
