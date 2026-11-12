# Christmas Party 2026 Registration — Setup

This is an offline-first registration site with:
- Public name-only registration (no accounts/passwords)
- Attendee dashboard and manual entry
- Copy all names, TXT export (one name per line), and CSV export
- Local browser storage for offline registration
- Optional shared Google Sheets backend for multiple phones/laptop
- PWA service worker so the site shell can open offline after it has been visited once

## Important offline behavior

A phone can open the site offline only if it has already loaded the site online and the browser has cached it. When fully offline, each device stores its own registrations locally. Those registrations are queued and sent to Google Sheets when that device reconnects.

For a no-internet event where multiple phones must all register into one shared list immediately, connect the phones and laptop to the same Wi-Fi network and use a local server on the laptop. This starter package does not include a LAN server. The simplest reliable no-internet fallback is to use the laptop for all registrations.

## 1. Create the shared Google Sheet backend

1. Create a blank Google Sheet.
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with the code in `Code.gs`.
4. Save the project.
5. Click **Deploy → New deployment**.
6. Select type **Web app**.
7. Set **Execute as: Me**.
8. Set **Who has access: Anyone**.
9. Deploy and authorize the script.
10. Copy the Web App URL ending in `/exec`.

Anyone who has the public registration website can submit a name. The backend stores names in your sheet. The list endpoint is also public; do not use this for confidential attendee information.

## 2. Host the website

1. Upload `index.html`, `manifest.webmanifest`, `sw.js`, and `icon.svg` to a Netlify site (or another HTTPS static host).
2. Open the deployed website on your laptop.
3. Select **Attendee List**.
4. Paste the Apps Script `/exec` URL into **Online database URL**.
5. Click **Save database URL**, then **Test connection**.
6. Keep this URL on the admin laptop. Each attendee phone does not need to configure it; the public site code will need the same backend URL configured in its browser storage if they submit directly.

### Configure the backend URL for all visitor devices

For a public QR registration flow, set the Apps Script URL in the source before publishing:
- In `index.html`, find `let backendUrl = localStorage.getItem(URL_KEY) || "";`
- Replace it with `let backendUrl = localStorage.getItem(URL_KEY) || "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";`
- Publish the updated site again.

Then all phones and the laptop use the same central Google Sheet automatically.

## 3. QR code and Duck Race

1. Open the hosted site on the laptop.
2. Select **Attendee List**. The QR code points to the current website URL.
3. Print or display the QR code at the registration booth.
4. After registration, click **Copy all names** or **Download TXT**.
5. Open the Duck Race Name Picker and paste the TXT contents. Each name is on its own line.

## 4. Offline limitations to know

- The site must be opened online once on each phone before that phone can reopen it offline.
- Offline registrations are device-local until that device reconnects.
- If the whole venue has no internet and you need one shared list across multiple phones, use a laptop-hosted local server on the same Wi-Fi/LAN; this package's built-in offline mode does not create that LAN server.
- Do not clear browser data before syncing queued registrations.
- Google Apps Script is a lightweight event tool, not a high-security database. Since you requested no admin password, anyone who knows the public site can view the attendee list through the app and submit names.

## Suggested event-day procedure

- Test the QR code and a test registration before the event.
- Test one phone and the admin laptop.
- Keep the laptop charged and connected to the venue Wi-Fi.
- If internet drops, use the laptop for registrations or let phones queue names locally and sync later.
- Before starting Duck Race, refresh the dashboard and export the final TXT file.
