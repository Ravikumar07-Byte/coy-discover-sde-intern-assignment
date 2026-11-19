// Tiny JSON-file store. Swipes persist across restarts; writes are atomic (tmp file + rename).
const fs = require('fs');
const path = require('path');
const { buildProfiles } = require('./seed');

function createStore(file) {
  let state;

  function save() {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
    fs.renameSync(tmp, file);
  }

  function seed() {
    state = { profiles: buildProfiles(), swipes: {} }; // swipes: { [profileId]: {direction, at, matched} }
    save();
  }

  function load() {
    try {
      state = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!state.profiles || !state.swipes) throw new Error('bad shape');
    } catch {
      seed();
    }
  }

  // PRIVACY: `likesMe` never leaves this module.
  const toPublic = (p) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    place: p.place,
    bio: p.bio,
    interests: p.interests,
    photo: `/api/avatar/${p.id}.svg`,
  });

  load();

  return {
    getFeed() {
      return state.profiles.filter((p) => !state.swipes[p.id]).map(toPublic);
    },

    swipe(profileId, direction) {
      const profile = state.profiles.find((p) => p.id === profileId);
      if (!profile) return { error: 'not_found' };
      if (state.swipes[profileId]) return { error: 'already_swiped' };

      // A match exists only if the user likes AND the profile already liked the user.
      const matched = direction === 'like' && profile.likesMe === true;
      const at = new Date().toISOString();
      state.swipes[profileId] = { direction, at, matched };
      save();
      return { matched, profile: matched ? toPublic(profile) : null, matchedAt: matched ? at : null };
    },

    getMatches() {
      return state.profiles
        .filter((p) => state.swipes[p.id]?.matched)
        .map((p) => ({ ...toPublic(p), matchedAt: state.swipes[p.id].at }))
        .sort((a, b) => b.matchedAt.localeCompare(a.matchedAt));
    },

    getProfile(id) {
      const p = state.profiles.find((x) => x.id === id);
      return p ? toPublic(p) : null;
    },

    reset: seed,

    // test helper only, not exposed over HTTP
    _likerIds: () => state.profiles.filter((p) => p.likesMe).map((p) => p.id),
  };
}

module.exports = { createStore };
