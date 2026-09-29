# Vorun — Placas tipográficas

PWA client-side para crear y exportar placas tipográficas de Instagram. No usa backend, cuentas ni servicios externos en tiempo de ejecución.

## Desarrollo

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run typecheck
npm run build
npm run preview
```

## Fuentes

DM Sans e Italiana se incluyen mediante los paquetes `@fontsource/*`. Vite copia los archivos WOFF2 dentro del build, por lo que funcionan offline y no dependen de Google Fonts ni de fuentes instaladas en el dispositivo. Antes de renderizar o exportar se verifican con `document.fonts.ready`, `document.fonts.load()` y `document.fonts.check()`.

## PWA en iPhone

La instalación requiere servir el build por HTTPS (o localhost durante desarrollo). En Safari: Compartir → **Agregar a inicio**. Abrí la app una vez con conexión para que el service worker almacene la interfaz y las fuentes.
