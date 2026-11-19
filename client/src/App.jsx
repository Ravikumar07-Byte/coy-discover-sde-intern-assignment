import { useState } from 'react';
import Discover from './components/Discover.jsx';

export default function App() {
  const [tab, setTab] = useState('discover');

  return (
    <div className="app">
      <div className="screen">
        {/* Placeholder tab: intentionally blank, per the brief */}
        {tab === 'home' && <main className="blank" aria-label="Home" />}
        {/* Kept mounted so swipe state survives tab switches */}
        <div hidden={tab !== 'discover'} className="fill">
          <Discover />
        </div>
      </div>

      <nav className="tabbar" aria-label="Main">
        <button className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')} aria-current={tab === 'home'}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4z" /></svg>
          Home
        </button>
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')} aria-current={tab === 'discover'}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
          Discover
        </button>
      </nav>
    </div>
  );
}
