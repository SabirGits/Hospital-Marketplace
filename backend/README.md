# Hospital Marketplace — Backend API

Express + MongoDB backend for the Hospital Marketplace frontend. Handles provider
(hospital/clinic/medical) registration with admin approval, a separate admin login,
patient sessions, Google sign-in, password reset, and per-account notifications.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_secret_string
ADMIN_EMAIL=admin@hospitalmarketplace.in
ADMIN_PASSWORD=Admin@123
GOOGLE_CLIENT_ID=            # optional — only for the frontend's Google button
```

Then run:

```bash
npm run dev
```

The **admin account is created automatically** the first time the server connects to
your database, using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` — there's no seed
script to run separately. Changing those values later only matters if no admin exists
yet; it won't update an already-created admin.

## How the approval workflow works

1. A hospital/clinic/medical signs up → `POST /api/auth/register` → saved with
   `status: "pending"`. They **cannot log in yet**.
2. Admin logs in separately (`POST /api/admin/login` — completely different
   credentials/table from provider accounts) and reviews `GET /api/admin/requests`.
3. **Approve** (`POST /api/admin/requests/:id/approve`) → `status: "approved"` →
   they can now log in, and if they're a hospital, they show up on the public
   `/api/hospitals/*` endpoints.
4. **Reject** (`POST /api/admin/requests/:id/reject`) → the record is **deleted
   immediately** — nothing not accepted sticks around, per spec.
5. **Delete** (`DELETE /api/admin/requests/:id`) — separate from reject: lets the
   admin remove a record at any time, including one that's already approved.

## API reference

### Auth (`/api/auth`)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/register` | name, email, password, location, phone, role, + role-specific fields | Creates a `pending` account |
| POST | `/login` | email, password | 403 if `pending`/`rejected` |
| POST | `/google` | credential (Google ID token) | Verified server-side against Google; still requires an `approved` account with that email |
| POST | `/patient-login` | name, email | No password — upserts a `Patient` record |
| POST | `/forgot-password` | email | Returns `demoCode` (no email service wired up — see note below) |
| POST | `/verify-reset-code` | email, code | |
| POST | `/reset-password` | email, code, newPassword | |

### Admin (`/api/admin`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/login` | — | Separate credentials from providers |
| GET | `/requests` | Admin JWT | Every provider account, any status |
| POST | `/requests/:id/approve` | Admin JWT | |
| POST | `/requests/:id/reject` | Admin JWT | Deletes the record |
| DELETE | `/requests/:id` | Admin JWT | Deletes regardless of status |

### Hospitals (`/api/hospitals`) — public, approved-only
| Method | Path |
|---|---|
| GET | `/all` |
| GET | `/city/:city` |
| GET | `/:id` |

### Notifications (`/api/notifications`)
| Method | Path | Notes |
|---|---|---|
| GET | `/:recipient` | `"admin"` or a provider's email |
| DELETE | `/clear/:recipient` | |
| DELETE | `/:id` | |

## What's real vs. what's a placeholder

- **Real**: everything above is a genuine MongoDB-backed flow — password hashing
  (bcrypt), JWT auth, Google token verification, the approval/delete workflow.
- **Placeholder**: password reset doesn't send an actual email — there's no email
  service configured, so the code comes back in the API response instead
  (`demoCode`). Wire up something like `nodemailer` in `authController.js`'s
  `requestPasswordReset` when you're ready, and stop returning the code in the
  response.
- **Not built yet**: Doctors, Clinics-as-their-own-entity, Services, Treatments have
  no models/routes here — the frontend still uses local demo data for those (see the
  frontend README for exactly which `api.js` functions are still mocked).

## Project structure

```text
backend/
├── server.js
├── models/          User, Admin, Notification, Patient
├── controllers/     authController, adminController, hospitalController, notificationController
├── routes/          authRoutes, adminRoutes, hospitalRoutes, notificationRoutes
├── middleware/       auth.js — JWT verify + admin-only guard
└── utils/            bootstrapAdmin.js — creates the admin account from .env on startup
```

## This update — image upload + edit endpoints

- `User` and `Admin` models now have an `image` field (base64 data URI — no file
  storage service is set up, so the image lives directly on the document; body
  size limit raised to 6MB in `server.js` to make room for it).
- `GET/PUT /api/auth/me` — a logged-in provider can view/edit their own record,
  image included.
- `PUT /api/admin/requests/:id` — admin can edit **any** provider record (all
  fields, including image) without changing its approval status.
- `GET/PUT /api/admin/profile` — the admin's own name/photo, separate from
  managing provider records.

## This update — Doctors are real now, plus ratings

- **New `Doctor` model** — belongs to a hospital (`hospitalId`), has its own
  image, specialty, fee, languages, bio, and a per-day sitting schedule.
  `routes/doctorRoutes.js`: public `GET /all`, `GET /:id`,
  `GET /hospital/:hospitalId`; provider-only (must own the doctor)
  `POST /`, `PUT /:id`, `DELETE /:id`; public `POST /:id/rate`.
- **Clinics and Medical providers now have their own public listing
  endpoints** too (`/api/clinics/*`, `/api/medical/*`) — same shape as
  `/api/hospitals/*` (all/city/:city/:id + rate), built off a shared
  `controllers/providerController.js` factory since all three roles live in
  the same `User` collection.
- **Ratings** — `User` (hospitals/clinics/medical) and `Doctor` both track
  `ratingSum`/`ratingCount`; `POST /:id/rate` with `{ rating: 1-5 }` updates
  it, and the average is computed automatically in the model's `toJSON`
  (`.rating`, `.reviews`). No login required to rate, and there's no
  duplicate-vote prevention yet — worth adding if that matters to you.
