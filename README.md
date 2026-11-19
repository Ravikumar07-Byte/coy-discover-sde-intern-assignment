# Coy · Discover Tab

🚀 Live Demo: https://coy-discover-demo.onrender.com

A mobile-first, swipe-based profile discovery experience built for the **Coy SDE Intern Assignment (Part B)**.

Part A, containing two proposed product improvements, is documented in [`PART_A_FEATURES.md`](./PART_A_FEATURES.md).

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Data Persistence:** JSON-file storage
- **Testing:** Node.js built-in test runner

## Live Deployment

The application is deployed on Render and can be accessed here:

**Live Application:** https://coy-discover-demo.onrender.com

**Source Code:** https://github.com/Ravikumar07-Byte/coy-discover-sde-intern-assignment

The application runs as a React frontend served by a Node.js and Express backend.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

Clone the repository and install dependencies:

```bash
npm run install:all
```

### Run the application

```bash
npm run dev
```

This starts:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

Open the frontend URL in your browser. To test on a mobile device connected to the same network, use the LAN URL printed by Vite.

### Production mode

```bash
npm start
```

This builds the frontend and serves the application through the backend on port `3001`.

## Application Features

### 1. Home

- Blank Home placeholder, as required by the assignment.

### 2. Discover

- Displays one profile card at a time.
- Supports swipe gestures on mobile.
- Provides Like and Pass buttons.
- Supports keyboard navigation using the left and right arrow keys on desktop.
- Prevents previously swiped profiles from appearing again.
- Provides an empty state when all available profiles have been reviewed.

### 3. Mutual Matches

- Creates a match only when both users have liked each other.
- Displays mutual matches in a dedicated Matches view.
- Shows a match confirmation when a mutual like occurs.

### 4. Demo Profiles

- Includes 36 seeded mock profiles.
- 12 profiles have already liked the demo user.
- Incoming likes are never disclosed in the Discover feed.
- Reset demo data restores the initial profile and match state.

## Demo Walkthrough

1. Open the Discover tab and review the available profiles.
2. Swipe right or click the Like button to like a profile.
3. Continue liking profiles until a mutual match occurs. A match confirmation should appear when the other profile has already liked the demo user.
4. Open Matches to view mutual matches.
5. Swipe left or click Pass on another profile. That profile should disappear from the feed.
6. Reload the application and verify that previous swipes and matches remain saved.
7. Continue swiping through all profiles to see the empty state.
8. Select **Reset demo data** to restore the original demo dataset.

**Controls:**
- Mobile: Drag the profile card left or right.
- Desktop: Use the Like and Pass buttons or keyboard arrow keys.

## API Documentation

The backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/feed` | Returns profiles that have not yet been swiped on. |
| POST | `/swipe` | Records a Like or Pass action and checks for a mutual match. |
| GET | `/matches` | Returns mutual matches, newest first. |
| POST | `/reset` | Resets the demo data and clears previous swipes. |

The same endpoints are also available under `/api/*`.

### Swipe Request

```json
{
  "profileId": "profile-id",
  "direction": "like"
}
```

The `direction` field accepts `like` or `pass`.

### Swipe Response

```json
{
  "matched": true,
  "profile": {},
  "matchedAt": "timestamp"
}
```

A non-match response indicates that no mutual match was created.

### Error Handling

- `400` – Invalid request or input.
- `404` – Profile not found.
- `409` – Profile has already been swiped on.

## Privacy and Matching Logic

Coy's central promise is that users should never discover who liked them unless the interest is mutual. The implementation protects this principle at the backend level.

- **Incoming likes remain private:** The `likesMe` property is stored server-side only. The public profile mapper removes this property before returning profile data to the frontend.
- **Mutual likes are required:** A match is created only when the current user likes a profile that has already liked them.
- **Passing never creates a match:** Passing a profile does not reveal whether that person liked the user.
- **No response-based information leakage:** Non-match swipe responses are identical regardless of whether the profile had already liked the user.
- **No repeated swiping:** Once a profile has been swiped on, it is removed from the feed. Further attempts are rejected with HTTP `409`.
- **Shuffled feed:** Seeded profiles are shuffled to avoid grouping incoming likers together in the feed.

These privacy rules are covered by automated tests.

## Testing

Run the backend test suite:

```bash
npm test
```

The test suite covers:

1. Seed data contains at least 30 profiles and includes incoming likes.
2. Feed responses never expose incoming-like information.
3. One-sided likes do not create matches.
4. Mutual likes correctly create matches.
5. Passing someone who liked the user never creates a match.
6. Swiped profiles disappear and cannot be swiped again.
7. Swipes and matches persist after a server restart.
8. Invalid input returns `400`, and unknown profiles return `404`.
9. The feed displays an empty state after all profiles are swiped.
10. Non-match responses do not reveal whether an incoming like exists.

## Project Structure

```text
coy-discover/
│
├── server/
│   ├── index.js
│   ├── db.js
│   ├── seed.js
│   ├── avatar.js
│   ├── data/
│   │   └── db.json
│   └── test/
│
├── client/
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── Discover
│       │   ├── SwipeCard
│       │   ├── MatchModal
│       │   └── Matches
│       ├── api.js
│       └── styles.css
│
├── PART_A_FEATURES.md
├── package.json
└── README.md
```

## Implementation Decisions and Trade-offs

- **Single demo user:** The implementation uses one hard-coded demo user, keeping the scope focused on the assignment's discovery and mutual-matching requirements.
- **JSON-file persistence:** JSON storage keeps the project simple to run without requiring an external database. The storage layer can be replaced with SQLite or PostgreSQL without changing the API routes.
- **Mock profile images:** Placeholder profile images are generated as SVGs and served by the API.
- **Optimistic UI:** The frontend removes a swiped card immediately and restores it if the backend request fails.

## Assignment Coverage

The implementation focuses on the requested mobile-first Discover experience, profile swiping, mutual matching, persistent swipe history, empty states, API endpoints and privacy protection.

The application is designed to demonstrate the core discovery and matching flow with seeded mock data, rather than a complete production authentication or multi-user deployment system.
