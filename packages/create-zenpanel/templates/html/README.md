# ZenPanel (HTML)

Plain HTML / CSS / JavaScript — **no Vite / no React**. Tailwind CSS **v4** via the official CLI (`@import "tailwindcss"` in CSS).

## Scripts

```bash
npm install
npm run build   # compile Tailwind → src/css/styles.css
npm run dev     # CSS watch + static server
```

Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login).

Preview credentials: `admin` / `admin`.

## Layout

```
src/
  index.html
  admin/           # login, dashboard, resource pages
  css/
    input.css      # Tailwind v4 source (@import "tailwindcss")
    styles.css     # generated — linked from HTML
    admin.css
    shell.css
  js/
public/            # optional static assets
```

## Customize

- Theme tokens: `src/css/input.css` (`@theme`)
- Branding / nav: `src/js/config.js`
