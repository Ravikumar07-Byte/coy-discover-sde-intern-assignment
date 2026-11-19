export default function Matches({ matches, onBack }) {
  if (!matches.length) {
    return (
      <div className="empty">
        <h2>No matches yet</h2>
        <p>A match appears only when you both like each other. Keep swiping.</p>
        <button className="primary" onClick={onBack}>Back to Discover</button>
      </div>
    );
  }
  return (
    <ul className="matchlist">
      {matches.map((m) => (
        <li key={m.id}>
          <img src={m.photo} alt={m.name} />
          <div>
            <strong>{m.name}, {m.age}</strong>
            <span>{m.place}</span>
            <span className="when">Matched {new Date(m.matchedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
