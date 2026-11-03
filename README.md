# Tendencias Digitales AR

Portal editorial estático con secciones de movilidad y titulares RSS enlazados a sus medios originales.

## Configurar fuentes RSS

El proyecto no trae fuentes de terceros preconfiguradas. Antes de usarlas, verificá que cada medio permita en sus términos mostrar sus titulares y enlaces en tu sitio, especialmente si el sitio tiene finalidad comercial o publicitaria. No se copian artículos completos ni imágenes del feed.

En Vercel, creá estas variables de entorno con una o más URL RSS HTTPS, separadas por coma:

- `AUTOS_RSS_URLS`
- `MOTOS_RSS_URLS`

El ejemplo local está en `.env.example`. No incluyas credenciales ni claves en el HTML o en el repositorio. La función limita cada categoría a cinco feeds y muestra hasta dieciséis titulares con atribución y enlace al medio original.

Google News RSS no está configurado: sus condiciones del feed consultado restringen el uso a lectores personales y no comerciales.

## Ejecutar

Instalá dependencias con `npm install` y desplegá el proyecto en Vercel. La interfaz consulta `/api/news`; al abrir `public/index.html` como archivo local, los titulares dinámicos no se cargan.

Pruebas del endpoint:

```sh
node --test api/news.test.js
```