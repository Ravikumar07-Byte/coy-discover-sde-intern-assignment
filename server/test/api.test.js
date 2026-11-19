const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { createApp } = require('../index');
const { createStore } = require('../db');
const { TOTAL, LIKES_ME_COUNT } = require('../seed');

function setup() {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'coy-')), 'db.json');
  const app = createApp(file);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, url, body) => {
    const r = await fetch(base + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: r.status, body: await r.json() };
  };
  return { file, app, server, call, store: app.locals.store };
}

test('seed has 30+ profiles and some already like the user', () => {
  const { server, store } = setup();
  assert.ok(TOTAL >= 30);
  assert.equal(store._likerIds().length, LIKES_ME_COUNT);
  server.close();
});

test('feed never exposes likesMe or any hint of it', async () => {
  const { server, call } = setup();
  const { body } = await call('GET', '/feed');
  assert.equal(body.length, TOTAL);
  for (const p of body) {
    assert.deepEqual(Object.keys(p).sort(), ['age', 'bio', 'id', 'interests', 'name', 'photo', 'place']);
  }
  server.close();
});

test('liking someone who has NOT liked you is not a match', async () => {
  const { server, call, store } = setup();
  const likers = new Set(store._likerIds());
  const target = (await call('GET', '/feed')).body.find((p) => !likers.has(p.id));
  const r = await call('POST', '/swipe', { profileId: target.id, direction: 'like' });
  assert.equal(r.body.matched, false);
  assert.equal(r.body.profile, null);
  assert.equal((await call('GET', '/matches')).body.length, 0);
  server.close();
});

test('liking someone who liked you creates a match', async () => {
  const { server, call, store } = setup();
  const id = store._likerIds()[0];
  const r = await call('POST', '/swipe', { profileId: id, direction: 'like' });
  assert.equal(r.body.matched, true);
  assert.equal(r.body.profile.id, id);
  const m = (await call('GET', '/matches')).body;
  assert.equal(m.length, 1);
  assert.equal(m[0].id, id);
  server.close();
});

test('passing on someone who liked you never creates a match', async () => {
  const { server, call, store } = setup();
  const id = store._likerIds()[0];
  const r = await call('POST', '/swipe', { profileId: id, direction: 'pass' });
  assert.equal(r.body.matched, false);
  assert.equal((await call('GET', '/matches')).body.length, 0);
  server.close();
});

test('swiped profiles disappear from feed and cannot be swiped twice', async () => {
  const { server, call } = setup();
  const first = (await call('GET', '/feed')).body[0];
  await call('POST', '/swipe', { profileId: first.id, direction: 'pass' });
  const feed = (await call('GET', '/feed')).body;
  assert.equal(feed.length, TOTAL - 1);
  assert.ok(!feed.some((p) => p.id === first.id));
  const again = await call('POST', '/swipe', { profileId: first.id, direction: 'like' });
  assert.equal(again.status, 409);
  server.close();
});

test('swipes and matches persist across a restart (reload)', async () => {
  const { file, server, call, store } = setup();
  const id = store._likerIds()[0];
  await call('POST', '/swipe', { profileId: id, direction: 'like' });
  server.close();
  const reloaded = createStore(file);
  assert.equal(reloaded.getMatches().length, 1);
  assert.equal(reloaded.getFeed().length, TOTAL - 1);
});

test('validation: bad input -> 400, unknown profile -> 404', async () => {
  const { server, call } = setup();
  assert.equal((await call('POST', '/swipe', { profileId: 'x', direction: 'like' })).status, 400);
  assert.equal((await call('POST', '/swipe', { profileId: 1, direction: 'maybe' })).status, 400);
  assert.equal((await call('POST', '/swipe', { profileId: 9999, direction: 'like' })).status, 404);
  server.close();
});

test('empty state: swiping everyone leaves an empty feed', async () => {
  const { server, call } = setup();
  const feed = (await call('GET', '/feed')).body;
  for (const p of feed) await call('POST', '/swipe', { profileId: p.id, direction: 'pass' });
  assert.equal((await call('GET', '/feed')).body.length, 0);
  server.close();
});

test('non-match responses are identical whether or not the profile liked you', async () => {
  const { server, call, store } = setup();
  const liker = store._likerIds()[0];
  const non = (await call('GET', '/feed')).body.find((p) => !store._likerIds().includes(p.id));
  const a = await call('POST', '/swipe', { profileId: liker, direction: 'pass' });
  const b = await call('POST', '/swipe', { profileId: non.id, direction: 'pass' });
  assert.deepEqual(a.body, b.body);
  server.close();
});
