import { fetchAllFeeds } from './_lib/ics.js';

export default async function handler(req, res) {
  const events = await fetchAllFeeds();
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    generatedAt: new Date().toISOString(),
    count: events.length,
    events: events.map((e) => ({
      start: e.start,
      end: e.end,
      source: e.source,
    })),
  });
}
