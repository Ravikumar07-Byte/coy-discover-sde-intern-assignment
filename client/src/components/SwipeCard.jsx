import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

const THRESHOLD = 110;   // px dragged before a release counts as a swipe
const EXIT_MS = 260;

const SwipeCard = forwardRef(function SwipeCard({ profile, onSwiped }, ref) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState(null); // 'like' | 'pass' once released
  const origin = useRef(null);
  const done = useRef(false);

  const fling = useCallback(
    (dir) => {
      if (done.current) return;
      done.current = true;
      setExit(dir);
      setTimeout(() => onSwiped(profile, dir), EXIT_MS);
    },
    [onSwiped, profile]
  );

  useImperativeHandle(ref, () => ({ swipe: fling }), [fling]);

  const down = (e) => {
    if (done.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };
  const move = (e) => {
    if (!origin.current) return;
    setPos({ x: e.clientX - origin.current.x, y: (e.clientY - origin.current.y) * 0.35 });
  };
  const up = () => {
    if (!origin.current) return;
    origin.current = null;
    setDragging(false);
    if (Math.abs(pos.x) > THRESHOLD) fling(pos.x > 0 ? 'like' : 'pass');
    else setPos({ x: 0, y: 0 });
  };

  const fly = typeof window !== 'undefined' ? window.innerWidth * 1.3 : 800;
  const x = exit ? (exit === 'like' ? fly : -fly) : pos.x;
  const rot = exit ? (exit === 'like' ? 24 : -24) : pos.x / 18;
  const likeOpacity = exit === 'like' ? 1 : Math.max(0, Math.min(pos.x / THRESHOLD, 1));
  const passOpacity = exit === 'pass' ? 1 : Math.max(0, Math.min(-pos.x / THRESHOLD, 1));

  return (
    <article
      className="card top"
      style={{
        transform: `translate(${x}px, ${exit ? 0 : pos.y}px) rotate(${rot}deg)`,
        transition: dragging ? 'none' : `transform ${EXIT_MS}ms cubic-bezier(.2,.8,.3,1)`,
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <CardBody profile={profile} />
      <span className="stamp like" style={{ opacity: likeOpacity }}>LIKE</span>
      <span className="stamp pass" style={{ opacity: passOpacity }}>PASS</span>
    </article>
  );
});

export function CardBody({ profile }) {
  return (
    <>
      <img src={profile.photo} alt={`${profile.name}`} draggable={false} />
      <div className="info">
        <h2>
          {profile.name}, <span>{profile.age}</span>
        </h2>
        <p className="place">{profile.place}</p>
        <p className="bio">{profile.bio}</p>
        <ul className="tags">
          {profile.interests.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SwipeCard;
