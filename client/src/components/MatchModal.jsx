export default function MatchModal({ profile, onKeepSwiping, onViewMatches }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="It's a match">
      <div className="match">
        <h2>It’s a match!</h2>
        <p>You and {profile.name} liked each other.</p>
        <div className="pair">
          <img src="/api/avatar/0.svg" alt="You" />
          <img src={profile.photo} alt={profile.name} />
        </div>
        <button className="primary" onClick={onViewMatches}>See your matches</button>
        <button className="ghost" onClick={onKeepSwiping}>Keep swiping</button>
      </div>
    </div>
  );
}
