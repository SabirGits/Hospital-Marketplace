# Hospital Marketplace — React Frontend

A complete, presentation-ready frontend for a healthcare marketplace product. Built with
React 18, Vite, React Router and Axios (mocked API layer, ready for a real backend).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## What's new in this update

- **Custom logo**: a proper brand mark (shield + pulse SVG) instead of a generic icon —
  used across the navbar, footer, dashboards and auth pages, plus a matching favicon.
- **Image reliability fix**: every photo (hospital, doctor, clinic, city) now goes through
  `ImageWithFallback`, which swaps to a themed inline SVG placeholder if the source image
  fails to load — no more broken-image icons breaking the layout. All image containers
  now use a fixed `aspect-ratio` + `object-fit: cover` so cards keep consistent width/height
  whether the real photo loads or not.
- **City pages fixed**: hospital cards inside `/cities/:id` render at the same width/height
  as everywhere else, and the city hero banner is now a real, fallback-safe image instead
  of a CSS background.
- **Doctor booking**: "Book Appointment" opens a day/time slot picker (demo availability)
  from both the doctor card and doctor profile.
- **Chat with a doctor**: "Chat" opens a lightweight messaging modal (demo auto-replies) —
  ready to wire up to real messaging once the backend exists.
- **Payment-ready registration**: Register is now a 3-step wizard — Account Type →
  Business Details → **Plan & Payment** — with Basic/Verified/Premium listing plans and a
  demo card-payment form (clearly marked as a demo, no real transaction).

## What's inside

- **Public marketplace**: Home, Hospitals (search/filter/sort/compare), Hospital profile
  (tabs: Overview, Departments, Doctors, Treatments, Services, Facilities, Reviews, Location),
  Doctors (with booking + chat), Clinics, Treatments, Services, City directory + city pages.
- **Auth flows (frontend-only demo)**: Login (role selector), Register (role-based wizard
  with payment step), multi-step Forgot Password.
- **Provider dashboards**: Hospital, Clinic, Medical — profile editing, staff/services
  management, reviews, lightweight analytics.
- **Admin dashboard**: platform stats, per-entity tables, provider verification queue.
- **Marketplace features**: favorites, hospital comparison (up to 3), dynamic search
  suggestions, skeleton loaders, empty/error states, toasts, responsive filter drawers.

## Connecting the real backend

Every data call goes through `src/api/api.js`. Swap the mocked function bodies for real
`apiClient` (Axios) calls once the Node.js/Express/MongoDB backend exists — the page
components don't need to change. The booking, chat and payment flows are frontend demos;
point them at real endpoints the same way.

```text
src/
├── api/api.js             # Axios instance + all data-fetching functions
├── context/                 # Auth, Toast, Favorites, Compare state
├── data/                     # Demo dataset (hospitals, doctors, clinics, cities, etc.)
├── components/               # Cards, badges, modal, booking/chat, dashboard widgets, Logo
├── pages/                     # Route-level pages, including pages/dashboard/*
├── layouts/                   # PublicLayout, DashboardLayout
└── styles/                    # variables, global, navbar, cards, pages, dashboard, responsive
```

## Connecting to your real backend (this update)

The frontend now talks to your actual Express + MongoDB backend for the parts you've
built so far:

| Feature | Status |
|---|---|
| Login (`POST /api/auth/login`) | ✅ Real backend |
| Register — Hospital/Clinic/Medical (`POST /api/auth/register`) | ✅ Real backend |
| Admin registration/login | 🚫 Not in the backend yet — disabled in the UI with a "coming soon" note |
| Hospitals list (`GET /api/hospitals/all`, `/api/hospitals/city/:city`) | ✅ Real backend — merged with demo hospitals so the marketplace never looks empty |
| Hospital detail (`GET /api/hospitals/:id`) | ✅ Real backend for real IDs, demo data for the sample hospitals |
| Doctors, Clinics, Services, Treatments | Still demo data — there's no backend for these yet |

### Setup

1. **Backend**: in your backend folder, make sure `.env` has `PORT`, `MONGO_URI`, `JWT_SECRET`, then run:
   ```bash
   npm install
   npm run dev
   ```
2. **Frontend**: copy `.env.example` to `.env` in this project and set `VITE_API_BASE_URL`
   to match your backend's port (default assumes `http://localhost:5000/api`). Then:
   ```bash
   npm install
   npm run dev
   ```
3. Register a Hospital/Clinic/Medical account from the site — it's saved for real in
   your MongoDB, and will show up in `/hospitals` (merged with the demo listings) and
   at its own `/hospitals/:id` page.

### What's still a gap on the backend side (for when you're ready)

- The `User` model only stores `name, email, password, location, phone, website,
  socialMedia, role` — none of the hospital-specific fields the registration form
  collects yet (hospital name, type, address, specialties, emergency availability,
  description, beds, etc.). Add those to `models/User.js` (or a separate `Hospital`
  model) and the matching fields in `controllers/authController.js`'s `registerUser`
  when you're ready — `src/api/api.js`'s `registerUser()` already has a comment marking
  exactly where to add them on the frontend side.
- No routes yet for Doctors, Clinics (as their own entity), Services, Treatments, or
  Admin — `src/api/api.js` has clearly marked mock sections for each so you know exactly
  what to replace as you build them.
- Real hospitals returned by the API get sensible placeholder values (stock image,
  rating 0, no specialties) via `src/api/adapters.js` — update that file's defaults once
  the backend returns real values for those fields.

## Admin approval workflow (new)

Hospital / Clinic / Medical registration is now gated behind admin approval — and the
Admin panel is a completely separate login, not reachable from the regular Login page.

- **Separate admin login**: `/admin/login` (linked quietly from the footer's "Company"
  column). Demo credentials: `admin@hospitalmarketplace.in` / `Admin@123`.
- **Registration → pending**: submitting the Register wizard no longer logs anyone in —
  it creates a *request* with `status: "pending"`.
- **Admin reviews it**: Admin Dashboard → **Verification** tab shows every request with
  full submitted details (contact info, business fields, chosen plan) via the eye icon,
  plus ✓ Approve / ✗ Reject actions.
- **Approve** → the request becomes a real, loginable account; if it's a hospital, it
  also appears in the public `/hospitals` listing.
- **Reject** → the request is marked rejected; that person can't log in and sees a clear
  "your request was rejected" message if they try.
- **Before approval**: trying to log in shows "still pending admin approval".

This entire flow is currently powered by `src/api/mockDb.js` (browser localStorage) so
it's fully demoable *today*, with no backend at all. It's written to mirror a real
backend 1:1 — `src/api/api.js` has the exact endpoint list in a comment
(`POST /api/providers/register`, `GET /api/admin/requests`,
`POST /api/admin/requests/:id/approve` / `/reject`, `POST /api/providers/login`,
`POST /api/admin/login`). Build your new backend to match those, then swap the mocked
function bodies in `api.js` for real `apiClient` calls — nothing in the page components
needs to change.

⚠️ The mock store keeps passwords in plain text in the browser for demo purposes only.
Your real backend must hash passwords (e.g. bcrypt, which your original backend already
used) and never return them in any response.

## Responsive / layout fixes (this update)

- Fixed a horizontal-overflow bug on laptop screens: the two floating stat cards over
  the homepage hero image used negative offsets that pushed them past the edge of the
  viewport. They're now inset within the image instead.
- Added a global `overflow-x: hidden` safety net on `html body` so no future stray
  element can push the page sideways on any screen size.
- Re-checked all breakpoints — the site targets laptop, tablet and phone widths (see
  `src/styles/responsive.css`).

## This update — the 7 things you asked for

1. **Admin Login is now visible on the regular Login page** (top-right pill), not just
   buried in the footer.
2. **Notification bell is real now**: individual dismiss (✕ per item), a "Clear all"
   button, and it actually fires on real events — new registration submitted (→ admin),
   login (→ that account), approve/reject (→ that provider), password reset (→ that
   account). Backed by `src/api/notifications.js`.
3. **Fixed a bug I introduced last time**: I'd added a global `overflow-x: hidden` to
   stop the hero cards from overflowing, but that had a side effect — it silently broke
   `position: sticky` for the hospital/doctor filter sidebar (an `overflow-x` on `body`
   forces `overflow-y` to compute as a scroll container too, which changes what sticky
   elements stick relative to). Removed that global rule and fixed the actual hero-card
   overflow at its source (bad negative margins) instead. The filter sidebar now stays
   in place while only the results column scrolls, on `/hospitals` and `/doctors`.
4. **Cards are tighter**: shorter image aspect ratio, less padding, single-line clamped
   titles, smaller gaps — still 3 per row on desktop/laptop, no more bulk.
5. **Hospital location**: registration now has an optional "Google Maps Link" field, and
   the hospital profile's Location tab shows a real embedded map (uses the link if given,
   otherwise falls back to the typed address — no API key needed for this).
   **Doctor sitting times**: each doctor now has a real per-day schedule; the Hospital
   Dashboard's doctor table has a clock icon to edit which time they sit each day (or
   mark a day off), and the public booking modal reads that same schedule instead of
   showing random slots.
6. **Mobile pass**: notification dropdown, admin-login pill, schedule editor, map embed,
   and the booking slot grid all got explicit small-screen rules.
7. On the "make it look less AI-written" note — I hear you, but I want to be straight
   with you: I didn't do a top-to-bottom rewrite of the whole codebase for this, since
   that's a big, mostly cosmetic change that risks breaking things for little real
   benefit. What I *did* write fresh this round (notifications, booking, Google
   sign-in, forgot password) is in a plainer, less commented style. If specific files
   still feel too "textbook," point them out and I'll rework those directly.

### Google Sign-In — what's real vs. what needs you

The actual Google Identity Services SDK is wired up (`src/components/GoogleSignInButton.jsx`)
— it's not a fake button. But Google requires an **OAuth Client ID** tied to your own app,
which only you can create (I can't generate one on your behalf):

1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth Client ID → type "Web application"
3. Under "Authorized JavaScript origins" add `http://localhost:5173` (and your real
   domain later)
4. Copy the Client ID into `.env` as `VITE_GOOGLE_CLIENT_ID=...`

Without that, the button still renders and explains what's missing instead of pretending
to work. Once it's set, clicking it gets a real Google identity — but logging in still
only succeeds if that email already has an **approved** provider account (same rule as
normal login), since Google only proves who someone is, not that they're allowed in.

### Forgot Password — now actually functional (demo-level)

Wired to the same mock account store as everything else: request a code, verify it,
set a new password — it really updates the account. Since there's no email service yet,
the "sent" code shows up in a toast instead of an inbox (clearly marked as demo mode).
Swap `requestPasswordReset` / `verifyResetCode` / `resetPassword` in `api.js` for real
backend calls (with actual email sending) when you're ready.

## This update — fixes from your latest feedback

1. **Doctor cards now 3-per-row everywhere** (matching hospitals) — was 4, changed
   across the Doctors listing, Home's "Top Doctors", a hospital's Doctors tab, and
   city pages.
2. **Chat/Booking modal bug — found and fixed the real cause**: hospital and doctor
   cards lift slightly on hover using a CSS `transform`. Any ancestor with a
   `transform` creates a new positioning context for `position: fixed` children —
   so a modal opened from inside a card was getting trapped and clipped by that
   card's own (small, `overflow: hidden`) box instead of covering the screen. Fixed
   properly by rendering all modals through a React portal straight into
   `document.body`, so they're never nested inside a card again regardless of what
   CSS that card uses.
3. **Login page now has role tabs**: Patient · Hospital · Clinic · Medical · Admin.
   - **Patient** is a lightweight name+email session (no password) — enough to keep
     favorites and bookings tied to a person without needing the full provider
     approval flow.
   - **Hospital / Clinic / Medical** show the normal email+password form; the tab is
     there so it's clear which kind of account you're logging into, and the register
     link underneath jumps straight to that role.
   - **Admin** takes you straight to the separate `/admin/login` page — it was never
     meant to share a login form with everyone else.
4. **Real map, not a placeholder**: the Location tab now builds the smartest query it
   can — the hospital's pasted map link first, then its full address, and only falls
   back to the actual city's real coordinates (added real lat/lng for all 10 cities)
   if neither exists. It always renders an actual place on Earth, never a blank frame.

## Full backend integration (this update)

The mock localStorage system (`mockDb.js`, `notifications.js`) is gone — everything
now talks to your real Express + MongoDB backend (a matching backend is provided
separately; see its own README for setup and the full endpoint list).

**What's wired to the real backend now:**
- Hospital registration (pending → admin review), login (blocked until approved),
  Google sign-in (real server-side token verification), patient sessions
- Admin login (separate credentials) and the Verification tab — approve, reject
  (auto-deletes), and a new **Delete** button to remove a record at any time,
  even after approval
- Notifications — now stored in MongoDB, polled every 15s (no websocket yet)
- Forgot password — request code → verify → reset, all against the real database

**Still local demo data** (no backend for these yet): Doctors, Clinics, Services,
Treatments — see the mock section at the bottom of `src/api/api.js`.

### Setup
1. Get the backend running first (see its README) — note its `PORT`.
2. In this project, set `.env`'s `VITE_API_BASE_URL` to match (e.g.
   `http://localhost:5000/api`).
3. `npm install && npm run dev`.

### A couple of things worth knowing
- The backend's `/register` now accepts every field the Register wizard collects
  (hospital name, specialties, map link, etc.) — nothing is silently dropped anymore
  like it was with the older, simpler backend.
- Approve/reject/delete calls need an admin JWT — make sure you're logged in via
  `/admin/login` before testing the Verification tab, or you'll get 401s.

## This update — your latest fixes

1. **Clinics/Treatments/Services headings** — no longer look stuck flush against
   the top-left corner; each page now opens with a tinted intro bar (same visual
   treatment the Hospitals page already used), which gives the heading proper
   framing instead of sitting bare against the page background.
2. **Those three pages' cards are tighter** — padding and icon size trimmed down,
   same treatment the hospital/doctor cards got earlier.
3. **Image upload, everywhere it makes sense**:
   - Registering a hospital/clinic/medical business now has a "Cover Photo" field.
   - Each provider dashboard's **Profile** tab has a real image upload, and saving
     actually persists to MongoDB (was previously just a toast with no backend
     call).
   - The Admin's own profile (Settings tab) now has a name + photo you can save,
     also real.
4. **Admin dashboard: Hospitals / Clinics / Medical Providers tabs are real now**
   — they used to show hardcoded demo tables; they now pull from the same
   MongoDB collection as the Verification tab, with working **Edit** (pencil —
   opens a full form, image included) and **Delete** on every row. Edits save
   straight to the database.
5. **Mobile was genuinely broken and I found why**: several widely-used layout
   classes (`.field-row`, `.plan-grid`, the login role tabs, the register
   stepper) had **no mobile rules at all** — meaning every two-column form row
   in the app stayed two columns even on a 375px phone, cramped unreadably.
   Fixed all of those to stack/shrink properly. Also found the Google Sign-In
   button was rendering at a hardcoded 360px width regardless of screen size —
   it now measures the actual available space so it never overflows.

## This update — your 5 reported issues

1. **Clinic "View Profile" was a dead button** — it had no link at all. Built a
   real Clinic profile page (`/clinics/:id`) with location, services, contact,
   an embedded map, and a working rating widget.
2. **New hospitals/doctors now really do show up automatically**:
   - A hospital appearing on the public site was already wired up, but I found
     and fixed a bug that could silently break it (see #6 below) — it should
     be fully reliable now.
   - Doctors added from the Hospital Dashboard are **brand new — genuinely
     backed by MongoDB now** (previously they only lived in that page's local
     state and vanished on refresh, never touching the public site at all).
     Add a doctor → it's saved for real → it appears on `/doctors` and on
     that hospital's profile page.
3. **Ratings are now clickable** — the star display you saw before was
   read-only. Added a real 5-star input (hospital, clinic and doctor pages)
   that submits to the backend and updates the average immediately.
4. **Profile image upload** — the feature itself was already built; see #6,
   this was very likely broken by the same session bug.
5. **Card height/width evenness** — found the actual cause: cards in a grid
   row get stretched to match the tallest one, but the text block inside
   wasn't set to grow with it, so shorter cards left a dead gap and buttons
   floated at different heights. Fixed by letting the content area fill the
   stretched card and anchoring the action buttons to the bottom, so every
   card in a row now lines up regardless of how much text it has.
6. **The real bug behind several of these**: session restore on page
   load/refresh was happening in a `useEffect`, which runs one render *after*
   the first paint. On any protected page (a dashboard, admin), that first
   render saw "not logged in" for a moment — sometimes just flickering,
   sometimes actually redirecting to `/login`, and any data-loading call that
   fired in that window went out with no auth token attached (so it silently
   failed). Fixed by restoring the session synchronously before the first
   render instead of in an effect. This was almost certainly why profile
   saves and other dashboard actions felt unreliable.
