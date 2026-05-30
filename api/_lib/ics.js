const FEEDS = [
  { name: 'vrbo', url: process.env.VRBO_ICAL_URL },
  { name: 'booking', url: process.env.BOOKING_ICAL_URL },
  { name: 'airbnb', url: process.env.AIRBNB_ICAL_URL },
];

export function parseIcsDate(value) {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

export function parseIcs(text) {
  const events = [];
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  let current = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT') {
      if (current && current.start && current.end) events.push(current);
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx);
      const value = line.slice(colonIdx + 1);
      if (key.startsWith('DTSTART')) current.start = parseIcsDate(value);
      else if (key.startsWith('DTEND')) current.end = parseIcsDate(value);
      else if (key === 'SUMMARY') current.summary = value;
      else if (key === 'UID') current.uid = value;
    }
  }
  return events;
}

export async function fetchAllFeeds() {
  const results = await Promise.all(
    FEEDS.map(async (feed) => {
      if (!feed.url) return [];
      try {
        const res = await fetch(feed.url, {
          headers: {
            'User-Agent': 'geddam-farms-availability/1.0 (+https://gvfarmsva.com)',
            Accept: 'text/calendar, text/plain, */*',
          },
        });
        if (!res.ok) {
          console.error(`Feed ${feed.name} returned HTTP ${res.status}`);
          return [];
        }
        const text = await res.text();
        return parseIcs(text).map((e) => ({ ...e, source: feed.name }));
      } catch (err) {
        console.error(`Feed ${feed.name} fetch failed:`, err);
        return [];
      }
    })
  );
  return results.flat();
}
