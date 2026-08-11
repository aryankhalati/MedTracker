MedTracker

A full-stack medicine adherence tracking app. Patients register, log prescriptions, get scheduled email reminders for each dose, track their adherence over time, and reorder medicine before supply runs out. Admins get a separate dashboard to view every patient and manage delivery status on reorders.

Live app: [med-tracker-eosin.vercel.app](https://med-tracker-eosin.vercel.app)
API: [medtracker-backend-nnrp.onrender.com](https://medtracker-backend-nnrp.onrender.com)

> Note: the backend is hosted on Render's free tier, which spins down after ~15 minutes of inactivity. The first request after idle can take 30-50 seconds to respond while the server wakes up.

---

Features

- Auth — registration with email OTP verification, JWT-based login, role-based access (patient / admin)
- Prescriptions — create/edit/delete, with support for multiple dose times per day
- Daily dose tracking — today's doses are generated automatically, mark each one taken or missed
- Live adherence stats — a running adherence percentage that updates immediately as doses are marked, no refresh needed
- Automated email reminders — a background job checks every minute and emails a reminder the moment a dose is due
- Low-stock alerts — a daily background job emails patients when a prescription's remaining supply drops below a threshold
- Admin dashboard — view all patients and all reorder requests, update delivery status through a pending → confirmed → out_for_delivery → delivered pipeline
- Role-based access control — admin-only routes are protected both in the UI and, more importantly, on the backend

---

 Tech Stack

Backend: Node.js, Express, MongoDB (Mongoose), JWT, Zod (request validation), node-cron (scheduled jobs), Brevo (transactional email API)

Frontend: React (Vite), React Router, Axios

Deployment: Render (backend), Vercel (frontend)

---

 Architecture Notes

- Dose logs are generated lazily — the first time a patient loads their dashboard on a given day, that day's `DoseLog` entries are created on the fly from the prescription's recurring `doseTimes`. There's no midnight cron job that has to iterate every user.
- Prescriptions are soft-deleted (`isActive` flag) rather than removed, since `DoseLog` and `Order` documents reference them and deleting the parent would break that history.
- Orders denormalize the medicine name at creation time, so a reorder request stays meaningful even if the original prescription is later edited or deleted.
- Every dose time is computed as an explicit IST offset, not the server's local system time — this app is deployed on infrastructure that runs in a different timezone than its users, so date/time logic can't rely on the host machine's ambient clock.
- Two background jobs run inside the same Express process via `node-cron`: a per-minute reminder check and a daily low-stock check.

---

 Getting Started Locally

 Prerequisites
- Node.js
- A MongoDB connection string (e.g. from MongoDB Atlas)
- A [Brevo](https://www.brevo.com/) account and API key for sending emails

 Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
ALLOWED_ORIGIN=http://localhost:5173
```

```bash
npm run dev
```

 Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

Project Structure

```
MedTracker/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas (User, Prescription, DoseLog, Order)
│   │   ├── routes/          # Express routers
│   │   ├── middleware/      # Auth, role checks, validation, error handling
│   │   ├── validators/      # Zod schemas
│   │   ├── jobs/            # node-cron background jobs
│   │   ├── utils/           # Helper functions (email, date math, OTP)
│   │   └── config/
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── pages/admin/
    │   ├── components/
    │   ├── context/         # Auth state (React Context)
    │   └── api/              # Axios instance
    └── package.json
```

---

Known Limitations

- API documentation (Swagger) is scaffolded but not filled in
- Free-tier hosting means occasional cold-start delays and a small risk of the per-minute reminder cron missing a cycle if the backend instance is asleep when a dose comes due
- No rate limiting specifically on OTP verification attempts beyond the general auth rate limiter

---

License

Personal portfolio project.