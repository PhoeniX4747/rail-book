# RailBook

RailBook is a polished React prototype that makes railway booking easier to understand. Instead of a dense booking portal, it offers a simple train search, a guided Smart Travel Assistant, clear availability explanations, and a complete mock booking flow.

> This is a hackathon-style demo. It uses mock railway data only—no real railway APIs, payments, or ticket bookings are involved.

## Highlights

- Local registration and login with salted, one-way password hashes.
- Manual train search with station dropdowns and a 45-day booking window.
- Smart Travel Assistant that asks for route, arrival date/time, and travel priorities.
- Preference-aware recommendations that show the top three trains only.
- Ten mock direct trains for every valid route between the five supported cities.
- Plain-language explanations for RAC, waitlists, Tatkal, and confirmation estimates.
- Passenger details, downloadable mock ticket, local trip history, and mock cancellation.
- Responsive desktop, tablet, and mobile layouts.

## Supported cities and mock coverage

RailBook supports five cities:

- Hyderabad
- Mumbai
- Bengaluru
- Chennai
- Pune

Each ordered city pair has ten direct, daily mock services. For example, Hyderabad → Mumbai and Mumbai → Hyderabad each return ten options for every selectable date.

```txt
5 cities × 4 possible destinations × 10 services = 200 generated mock trains
```

The selectable date range is today through the next 45 days.

## Smart Travel Assistant

The assistant does not search the whole dataset itself. It follows this flow:

```txt
User route and preferences
        ↓
Train service filters the local mock data
        ↓
10 direct matching trains
        ↓
Recommendation service ranks those matches
        ↓
Top 3 recommendations shown to the user
```

Travel priorities include comfortable travel, premium journey, cheapest fare, best value, fastest route, family friendly, avoiding waitlists, lower berth, flexible timing, and Tatkal readiness. Opposing preferences are handled automatically; for example, choosing Premium removes Cheapest fare.

## Authentication model

The prototype includes a browser-only registration and login flow.

- Account email, random salt, and password hash are stored in `localStorage`.
- Passwords are salted and hashed with the browser Web Crypto API using SHA-256.
- The password itself is never stored.
- `sessionStorage` contains only the signed-in email for the active browser session.

This is appropriate for a local demo, but it is **not production authentication**. A real application should use a server, HTTPS, secure session cookies, rate limiting, and a password hashing algorithm such as Argon2 or bcrypt.

## Tech stack

- React 19
- Vite
- React Router
- Context API
- Tailwind CSS integration with custom CSS
- Lucide React icons
- ESLint

## Run locally

Requirements: Node.js 20 or later is recommended.

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

Useful commands:

```bash
# Build the production bundle
npm run build

# Run lint checks
npm run lint

# Preview a production build
npm run preview
```

## Project structure

```txt
src/
├── components/       # Shared layout, common UI, and train cards
├── context/          # Authentication and booking state
├── data/             # Mock cities, stations, and train service templates
├── pages/            # Route-level views and user journeys
├── repositories/     # Mock-data access and generated train expansion
├── routes/           # Lazy-loaded application routing
├── services/         # Train search, ranking, booking, auth, and station logic
└── utils/            # Shared utilities such as booking-date limits
```

## Data and service architecture

Views do not read mock JSON directly:

```txt
React UI → Service → Repository → Mock JSON
```

The train repository expands five cities and ten reusable service templates into route-specific train objects. Replacing mock data with an API later should primarily affect the repository layer.

## Limitations

- Railway routes, availability, confirmation chances, fares, and tickets are simulated.
- All mock services run daily; availability does not change by date.
- Downloaded tickets are plain-text demonstration files.
- Local browser authentication is not a substitute for backend security.
