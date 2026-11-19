// Deterministic seed data: 36 mock profiles, 12 of whom have already liked the logged-in user.
// The output order is shuffled so the feed order can never hint at who liked you.

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  'Aanya', 'Ishaan', 'Meera', 'Kabir', 'Tara', 'Rohan', 'Diya', 'Arjun', 'Naina', 'Vihaan',
  'Sana', 'Aditya', 'Riya', 'Karan', 'Zoya', 'Dev', 'Anika', 'Neil', 'Myra', 'Yash',
  'Kiara', 'Reyansh', 'Pooja', 'Samar', 'Ira', 'Veer', 'Simran', 'Ayaan', 'Jia', 'Dhruv',
  'Mahi', 'Rehan', 'Avni', 'Tejas', 'Ananya', 'Manav',
];

const PLACES = [
  'Delhi University', 'IIT Delhi', 'Ashoka University', 'Amity University, Noida', 'Gurgaon',
  'Christ University, Bengaluru', 'BITS Pilani', 'Jamia Millia Islamia', 'Koramangala, Bengaluru',
  'Hauz Khas, Delhi', 'Symbiosis, Pune', 'Sector 29, Gurgaon',
];

const BIOS = [
  'Chai over coffee, always. Will judge your playlist kindly.',
  'Weekend trekker, weekday spreadsheet person.',
  'I make decent pasta and questionable puns.',
  'Looking for someone to split a dessert with.',
  'Film school dropout, still quoting dialogue.',
  'Early riser. Late-night conversationalist. Contradiction.',
  'Dog person who is slowly converting to cat person.',
  'Bad at texting, great at showing up.',
  'Currently learning guitar. My neighbours are patient.',
  'Cricket on the terrace, momos after.',
  'Reads three books at once and finishes none.',
  'Will happily plan your whole trip in a Notion doc.',
  'Gym at 6, gaming at 10. Balanced.',
  'Stand-up comedy fan. Open mic survivor.',
  'Plant parent of seven. Two are thriving.',
  'Ask me about my favourite street food in Old Delhi.',
  'Photography, filter coffee and long walks.',
  'Building things on weekends. Breaking them on Mondays.',
  'Biryani loyalist. Do not test me.',
  'Quiet at first, loud once comfortable.',
  'Sunsets, vinyl, and spontaneous road trips.',
  'Dancing in the kitchen is a valid cardio.',
  'Podcast addict. Ask for recs.',
  'Badminton partner wanted, competitive only.',
  'Sketchbook in my bag at all times.',
  'I will absolutely beat you at Uno.',
  'Overthinker, but make it cute.',
  'Fluent in sarcasm and Hinglish.',
  'Midnight Maggi enthusiast.',
  'Startup nerd who also loves slow Sundays.',
  'Baker in training. Taste-testers welcome.',
  'Cycling around campus, usually late.',
  'Poetry on the side, code during the day.',
  'Travel list is longer than my bank balance.',
  'Lo-fi, rain and old Bollywood.',
  'Here for good conversation and better food.',
];

const INTERESTS = [
  'Travel', 'Music', 'Coding', 'Cricket', 'Movies', 'Photography', 'Fitness', 'Reading',
  'Cooking', 'Gaming', 'Trekking', 'Art', 'Dance', 'Podcasts', 'Coffee', 'Standup',
  'Football', 'Writing', 'Startups', 'Anime',
];

const TOTAL = NAMES.length;     // 36
const LIKES_ME_COUNT = 12;

function buildProfiles() {
  const rand = mulberry32(2026);
  const profiles = NAMES.map((name, i) => {
    const pool = [...INTERESTS].sort(() => rand() - 0.5);
    return {
      id: i + 1,
      name,
      age: 19 + Math.floor(rand() * 9), // 19-27
      place: PLACES[Math.floor(rand() * PLACES.length)],
      bio: BIOS[i],
      interests: pool.slice(0, 3 + Math.floor(rand() * 3)),
      likesMe: false,
    };
  });

  // pick who already liked the user
  const idx = [...profiles.keys()].sort(() => rand() - 0.5).slice(0, LIKES_ME_COUNT);
  idx.forEach((k) => { profiles[k].likesMe = true; });

  // shuffle display order so likers are not clustered anywhere
  for (let i = profiles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [profiles[i], profiles[j]] = [profiles[j], profiles[i]];
  }
  return profiles;
}

module.exports = { buildProfiles, TOTAL, LIKES_ME_COUNT };
