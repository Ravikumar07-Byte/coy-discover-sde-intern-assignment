const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createStore } = require('./db');
const { avatarSvg } = require('./avatar');

function createApp(dataFile = path.join(__dirname, 'data', 'db.json')) {
  const store = createStore(dataFile);
  const app = express();
  app.use(cors());
  app.use(express.json());

  const api = express.Router();

  // GET /feed: profiles the user has not swiped on yet
  api.get('/feed', (req, res) => res.json(store.getFeed()));

  // POST /swipe { profileId, direction: "like" | "pass" } -> { matched, profile }
  api.post('/swipe', (req, res) => {
    const { profileId, direction } = req.body || {};
    if (!Number.isInteger(profileId)) return res.status(400).json({ error: 'profileId must be an integer' });
    if (direction !== 'like' && direction !== 'pass') {
      return res.status(400).json({ error: 'direction must be "like" or "pass"' });
    }
    const result = store.swipe(profileId, direction);
    if (result.error === 'not_found') return res.status(404).json({ error: 'Profile not found' });
    if (result.error === 'already_swiped') return res.status(409).json({ error: 'Already swiped on this profile' });
    // Identical response shape for every non-match, so the API leaks nothing about who liked the user.
    return res.json({ matched: result.matched, profile: result.profile, matchedAt: result.matchedAt });
  });

  // GET /matches: mutual matches only
  api.get('/matches', (req, res) => res.json(store.getMatches()));

  // Demo helper: wipe swipes and start over
  api.post('/reset', (req, res) => { store.reset(); res.json({ ok: true }); });

  // Placeholder photos
  api.get('/avatar/:id.svg', (req, res) => {
    const id = Number(req.params.id);
    const p = id === 0 ? { name: 'You' } : store.getProfile(id);
    if (!p) return res.status(404).end();
    res.type('image/svg+xml').set('Cache-Control', 'public, max-age=86400').send(avatarSvg(id, p.name));
  });

  app.use('/api', api);
  app.use(api); // also reachable without /api prefix: GET /feed, POST /swipe, GET /matches

  // Serve the built client in production
  const dist = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.locals.store = store;
  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3001;
  createApp().listen(port, () => console.log(`Coy API listening on http://localhost:${port}`));
}

module.exports = { createApp };
