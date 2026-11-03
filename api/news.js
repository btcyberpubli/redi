import Parser from "rss-parser";

const parser = new Parser({
  timeout: 5000,
  headers: {
    "User-Agent": "TendenciasDigitalesAR/1.0 (RSS reader)"
  }
});

const categoryFeeds = {
  autos: process.env.AUTOS_RSS_URLS,
  motos: process.env.MOTOS_RSS_URLS
};

function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  res.send(JSON.stringify(payload));
}

function getFeedUrls(value = "") {
  return value
    .split(",")
    .map((url) => url.trim())
    .filter((url) => {
      try {
        return new URL(url).protocol === "https:";
      } catch {
        return false;
      }
    })
    .slice(0, 5);
}

function normalizeItem(item, feedTitle) {
  let link;
  try {
    link = new URL(item.link);
  } catch {
    return null;
  }

  if (link.protocol !== "https:") return null;

  const parsedDate = item.isoDate || item.pubDate;
  const date = parsedDate ? new Date(parsedDate) : null;

  return {
    title: String(item.title || "").trim().slice(0, 300),
    source: String(item.creator || item.author || feedTitle || link.hostname).trim().slice(0, 120),
    date: date && !Number.isNaN(date.valueOf()) ? date.toISOString() : null,
    link: link.toString()
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Método no permitido." });
  }

  const category = String(req.query?.category || "").toLowerCase();
  if (!Object.hasOwn(categoryFeeds, category)) {
    return sendJson(res, 400, { error: "La categoría debe ser autos o motos." });
  }

  const feedUrls = getFeedUrls(categoryFeeds[category]);
  if (feedUrls.length === 0) {
    return sendJson(res, 200, { category, items: [], configured: false });
  }

  const results = await Promise.allSettled(
    feedUrls.map(async (url) => {
      const response = await fetch(url, {
        headers: { "User-Agent": "TendenciasDigitalesAR/1.0 (RSS reader)" },
        signal: AbortSignal.timeout(6000)
      });
      if (!response.ok) throw new Error(`Feed respondió ${response.status}`);

      const xml = await response.text();
      if (xml.length > 1_000_000) throw new Error("Feed demasiado grande");
      const feed = await parser.parseString(xml);

      return (feed.items || [])
        .map((item) => normalizeItem(item, feed.title))
        .filter((item) => item?.title && item.link)
        .slice(0, 8);
    })
  );

  const items = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .sort((left, right) => (right.date || "").localeCompare(left.date || ""))
    .slice(0, 16);

  return sendJson(res, 200, { category, items, configured: true });
}