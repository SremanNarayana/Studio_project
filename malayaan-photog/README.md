# Malayaan Photography

> Capturing Emotions. Creating Timeless Memories.

Luxury photography studio website with event booking requests and a client project tracking portal.

---

## Running it locally

### Easiest way (Windows)

Double-click **`start.bat`** in the project folder.
It installs dependencies on first run, starts the dev server, and opens `http://localhost:3000` in your browser.

To stop: close the terminal window or press `Ctrl + C`.

### Manual way

```bash
npm install        # first time only — installs all packages
npm run dev        # starts dev server on http://localhost:3000
```

Other commands:
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — type-aware ESLint

---

## Opening in a code editor

### VS Code (recommended)

Double-click **`open-in-vscode.bat`** — or:
1. Open VS Code.
2. **File → Open Folder…** → pick `C:\Users\ASUS\Desktop\malayaan-photography`.

The first time you open it, VS Code will prompt you to install the recommended extensions (defined in `.vscode/extensions.json`):
- Tailwind CSS IntelliSense
- ESLint, Prettier
- Pretty TS Errors
- Auto Rename Tag, Path Intellisense

Settings, formatting rules, and a debug launch config are pre-wired in `.vscode/`.

### Other editors

This is a standard Next.js project — open the folder in **WebStorm, Cursor, Sublime, or Zed** and everything works. The `.editorconfig` and `.prettierrc` files keep formatting consistent across editors.

---

## What's inside

| Route | Purpose |
| --- | --- |
| `/` | Marketing site (Hero with logo, About, Services, Portfolio, Why-Choose-Us, Process, Testimonials, Contact) |
| `/track` | Public booking approval and project lookup — credentials are **Tracking ID + Phone Number** |
| `/admin/login` | Admin sign-in (Supabase Auth) |
| `/admin` | Bookings CRUD + enquiry inbox |

## Connect the booking backend

Create `.env.local` and set the server-only URL of the standalone admin backend:

```bash
ADMIN_API_URL=http://localhost:5050
```

Do not prefix this variable with `NEXT_PUBLIC_`; the browser talks only to this Next.js app's `/api/enquiry` and `/api/track` proxies. The shared Express/MongoDB backend stores new requests as `Pending` until the studio approves them.

---

## Hooking up Supabase (optional — for real data)

The site works with built-in demo data until you wire Supabase. To go live:

1. Create a project at [supabase.com](https://supabase.com).
2. **Settings → API** — copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` *(keep secret)*
3. Paste them into `.env.local` (a starter file is already there).
4. Open the **SQL editor** and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
5. **Authentication → Users → Add user** with email + password.
6. In SQL editor:
   ```sql
   insert into public.admins (user_id, email)
   values ('<that-users-uuid>', 'you@example.com');
   ```
7. Restart `npm run dev`. Sign in at `/admin/login`.

---

## Tech stack

- **Next.js 15** (App Router, RSC, Route Handlers)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 3** — custom gold / ink luxury palette
- **Framer Motion 11** — reveals, transitions, lightbox
- **Supabase** (Postgres + RLS + Auth)
- **lucide-react** icons · Cormorant Garamond + Inter fonts

---

## Editing content

| What | Where |
| --- | --- |
| Brand colors / fonts | `tailwind.config.ts`, `app/globals.css` |
| Logo | `public/logo.png` (also `app/icon.png` for favicon) |
| Hero slideshow | `components/sections/Hero.tsx` |
| Services list | `components/sections/Services.tsx` |
| Portfolio gallery | `components/sections/Portfolio.tsx` |
| Reviews | `components/sections/Testimonials.tsx` |
| Contact details / phone / WhatsApp | `components/sections/Contact.tsx` + `components/Footer.tsx` + `components/WhatsAppFloat.tsx` |

Swap Unsplash URLs for the studio's own photos when ready.

---

## Deploy

Push to GitHub, import on [Vercel](https://vercel.com), set `ADMIN_API_URL` to the deployed Express backend URL (plus any Supabase variables still used by the legacy in-app admin), and deploy.
