# Elm Shakespeare Playbill (Next.js)

A Vercel-ready Next.js application that renders digital playbills backed by Google Sheets. Each spreadsheet inside a designated Drive folder becomes a playbill. Sheet tabs provide navigation sections, while configuration sheets (names wrapped in square brackets) expose key/value variables to the UI.

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the landing page and `http://localhost:3000/<playbill-slug>` for a specific playbill.

## Environment Variables

Configure the following variables in `.env.local` (and in Vercel project settings):

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` – service account email with access to the playbill folder.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` – multiline private key (copy from JSON; Vercel will escape newlines automatically, the app restores them).
- `GOOGLE_DRIVE_PLAYBILL_FOLDER_ID` – ID of the Drive folder that stores playbill spreadsheets.

The service account must have at least viewer access to the folder (and contained spreadsheets).

## Google Sheet Conventions

- **Spreadsheet name** → URL slug (`midsummer` ⇒ `https://playbill.elmshakespeare.org/midsummer`).
- **Visible tabs**: Sheet titles become navigation items. Titles are slugified (`Who's Who` ⇒ `whos-who`).
- **Configuration tabs**: Any sheet whose title is wrapped in square brackets (e.g. `[Configuration]`) is excluded from navigation. Each row should list a variable name in the first column and its value in the second column. These variables are available to the client (`description`, `subtitle`, etc.).
- **Tab data**: The first row is treated as the header. Subsequent rows are rendered in a responsive table. Empty rows are skipped.

## API

Server-side and API route share the same loader located at `lib/googleSheets.js`. The associated endpoint is available at `/api/playbill?slug=<playbill-slug>`. Responses contain:

```json
{
  "id": "spreadsheetId",
  "name": "Playbill Name",
  "slug": "playbill-name",
  "config": { "Description": "..." },
  "tabs": [
    {
      "title": "Who's Who",
      "slug": "whos-who",
      "rows": [{ "actor": "...", "role": "..." }],
      "raw": [["Actor", "Role"], ["...", "..."]]
    }
  ],
  "fetchedAt": "2025-11-12T00:00:00.000Z"
}
```

The response is cached in-memory for one minute per serverless instance to reduce Drive API calls.

## Deployment Notes

- Vercel automatically detects Next.js. No additional build command changes are needed.
- `next.config.js` includes a rewrite so both `/playbill/<slug>` and `/ <slug>` resolve to the same playbill page, mirroring legacy URLs.
- Configure environment variables in the Vercel dashboard and add the service account credentials as encrypted values.

## Manual Verification Checklist

1. Create or copy a spreadsheet into the configured Drive folder.
2. Rename the spreadsheet to match the intended slug (`midsummer`).
3. Add visible tabs for each section; include a `[Configuration]` tab with optional `description` and `subtitle` rows.
4. Deploy or run locally with the service account credentials.
5. Visit `/midsummer` to confirm navigation items and table content render as expected.
6. Add a new tab or configuration row and reload (data should reflect within ~1 minute because of cache TTL).
