import { fetchAllFeeds } from './_lib/ics.js';

function formatIcsDate(iso) {
  return iso.replace(/-/g, '');
}

function icsTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d+/, '');
}

function buildIcs(events) {
  const stamp = icsTimestamp();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Geddam Farms//Availability//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Geddam Farms - Blocked Dates',
  ];
  for (const e of events) {
    if (!e.start || !e.end) continue;
    const uid = `${e.source}-${e.uid || `${e.start}-${e.end}`}@gvfarmsva.com`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(e.start)}`);
    lines.push(`DTEND;VALUE=DATE:${formatIcsDate(e.end)}`);
    lines.push(`SUMMARY:Booked (${e.source})`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export default async function handler(req, res) {
  const events = await fetchAllFeeds();
  const ics = buildIcs(events);
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
  res.setHeader('Content-Disposition', 'inline; filename="geddam-farms.ics"');
  res.status(200).send(ics);
}
