import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import SwipeCard, { CardBody } from './SwipeCard.jsx';
import MatchModal from './MatchModal.jsx';
import Matches from './Matches.jsx';

export default function Discover() {
  const [queue, setQueue] = useState([]);
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState('cards'); // 'cards' | 'matches'
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [matchProfile, setMatchProfile] = useState(null);
  const [toast, setToast] = useState('');
  const cardRef = useRef(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [feed, mine] = await Promise.all([api.feed(), api.matches()]);
      setQueue(feed);
      setMatches(mine);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Called once the card's exit animation has finished
  const handleSwiped = useCallback(async (profile, direction) => {
    setQueue((q) => q.filter((p) => p.id !== profile.id)); // optimistic: never shown again
    try {
      const res = await api.swipe(profile.id, direction);
      if (res.matched) {
        setMatches((m) => [{ ...res.profile, matchedAt: res.matchedAt }, ...m]);
        setMatchProfile(res.profile);
      }
    } catch (err) {
      if (err.status === 409) return; // already recorded, nothing to do
      setQueue((q) => [profile, ...q]); // put it back so the swipe isn't lost
      showToast('Could not save that swipe. Try again.');
    }
  }, []);

  // Desktop: arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (view !== 'cards' || matchProfile) return;
      if (e.key === 'ArrowRight') cardRef.current?.swipe('like');
      if (e.key === 'ArrowLeft') cardRef.current?.swipe('pass');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, matchProfile]);

  const resetDemo = async () => {
    await api.reset();
    setView('cards');
    load();
  };

  const [top, next] = queue;

  return (
    <section className="discover">
      <header className="top-bar">
        <h1>Discover</h1>
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={view === 'cards'} className={view === 'cards' ? 'on' : ''} onClick={() => setView('cards')}>
            Swipe
          </button>
          <button role="tab" aria-selected={view === 'matches'} className={view === 'matches' ? 'on' : ''} onClick={() => setView('matches')}>
            Matches{matches.length > 0 && <b>{matches.length}</b>}
          </button>
        </div>
      </header>

      {view === 'matches' ? (
        <Matches matches={matches} onBack={() => setView('cards')} />
      ) : status === 'loading' ? (
        <div className="empty"><p>Loading profiles…</p></div>
      ) : status === 'error' ? (
        <div className="empty">
          <h2>Can’t reach the server</h2>
          <p>Check that the API is running on port 3001, then retry.</p>
          <button className="primary" onClick={load}>Retry</button>
        </div>
      ) : !top ? (
        <div className="empty">
          <h2>You’re all caught up</h2>
          <p>You’ve swiped on everyone nearby. New people show up here as they join.</p>
          <button className="primary" onClick={() => setView('matches')}>View matches</button>
          <button className="ghost" onClick={resetDemo}>Reset demo data</button>
        </div>
      ) : (
        <>
          <div className="stack">
            {next && (
              <article className="card behind" aria-hidden="true">
                <CardBody profile={next} />
              </article>
            )}
            <SwipeCard key={top.id} ref={cardRef} profile={top} onSwiped={handleSwiped} />
          </div>
          <div className="actions">
            <button className="round pass" aria-label="Pass" onClick={() => cardRef.current?.swipe('pass')}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <button className="round like" aria-label="Like" onClick={() => cardRef.current?.swipe('like')}>
              <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
            </button>
          </div>
          <p className="hint">Drag the card, use the buttons, or press ← →</p>
        </>
      )}

      {matchProfile && (
        <MatchModal
          profile={matchProfile}
          onKeepSwiping={() => setMatchProfile(null)}
          onViewMatches={() => { setMatchProfile(null); setView('matches'); }}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}
