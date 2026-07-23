# GIG-Egypt Challenge Hub — Website Version

A plain static website (HTML/CSS/JS, no build step, no backend) with the
same game as the Android app, plus a hidden, PIN-protected Admin panel.

## Files
```
index.html
style.css
script.js
assets/
  gig-egypt-logo.png
  gig-pattern.png
  factory-1.png / factory-2.png
  home-1.png / home-2.png
  office-1.png / office-2.png
```

## Running it
Just open `index.html` in a browser, or host the whole folder on any
static host (GitHub Pages, Netlify, S3, your own server, a booth laptop's
local web server, etc.) — no server-side code required.

## Data storage
Same as your original site: everything is saved in the browser's
`localStorage` under the key `gigChallengeScores`, so scores persist
across visits on the same device/browser, but not across different
devices/browsers (there's no shared backend/database — see note below if
you want that).

## Public Leaderboard vs. Admin panel
- **🏆 LEADERBOARD** (footer button, always visible): shows rank, name,
  and score only — no phone numbers, no export/delete controls. Safe for
  players to see on a booth screen.
- **🔐 Admin panel** (hidden): shows every field (name, phone, score,
  win/loss, timestamp) with Export CSV, Export JSON, and Clear All Scores.

### Opening the Admin panel
Click/tap the **GIG-Egypt logo in the top-left header 5 times within 3
seconds**. A PIN prompt appears — the default PIN is:

```
2580
```

**Change this before your event** — open `script.js`, find:
```js
const ADMIN_PIN="2580"; // change this before your event
```
and set your own PIN.

> Heads up: this is client-side obfuscation, not real security. Anyone who
> views the page source or your browser's dev tools can read the PIN
> straight out of `script.js`. It's enough to stop casual players from
> stumbling into admin data, but don't rely on it to protect anything
> sensitive if the site is publicly hosted. For real protection you'd
> need a backend to check the PIN server-side (see below).

### Exporting data
From inside the Admin panel:
- **EXPORT CSV** — downloads `GIG-Egypt-Challenge-Scores_<timestamp>.csv`
  (Rank, Name, Phone, Score, Won, Date)
- **EXPORT JSON** — downloads the same records as a pretty-printed JSON
  array
- **CLEAR ALL SCORES** — deletes every saved record from this
  browser's storage (asks for confirmation first)

Both exports trigger a normal browser download — same as clicking a
download link — so they land wherever your browser normally saves files.

## Important limitation: per-device/browser storage only
Because this is a static site with no backend, `localStorage` is
**local to each individual device and browser**. If you run this on
multiple booth tablets/laptops, each one has its own separate set of
scores — the Admin panel on Tablet A cannot see scores entered on
Tablet B. You'd need to export CSV/JSON from each device separately and
merge them, or add a small backend (e.g. a Google Sheet via Apps Script,
Firebase, or a simple API) if you need one shared leaderboard across
multiple devices. Happy to build that next if it's useful.

## Everything else
The game logic, all 3 levels, colors, and layout are identical to your
original site — only the admin/export layer and the public/private split
on the leaderboard are new.
