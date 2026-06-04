# BodyFit AI

Progressive Web App (PWA) untuk **AI Nutrition Coach**, **Meal Planner Indonesia**, **Gym Tracker**, **Progress Tracker**, dan **Dashboard Analytics**. Mobile-first, bisa di-install ke Home Screen iPhone & Android tanpa App Store, siap deploy ke Vercel.

Stack: **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase · OpenAI · Strava OAuth**

---

## ✨ Fitur

- **AI Nutrition Coach** — chat bahasa Indonesia, konteks makanan lokal (`/api/nutrition` → OpenAI).
- **Meal Planner Indonesia** — generate rencana makan 1–7 hari sesuai target kalori/makro (`/api/meals/generate`, output JSON terstruktur).
- **Gym Tracker** — catat sesi, hitung volume & estimasi 1RM (Epley).
- **Progress Tracker** — log berat badan + tren, integrasi **Strava OAuth**.
- **Dashboard Analytics** — cincin kalori, grafik volume mingguan & berat badan (SVG, tanpa library chart).
- **PWA** — installable, offline-ready (service worker network-first + offline fallback).

---

## 🏗️ Arsitektur (clean architecture)

```
src/
├── core/                 # Domain murni — TANPA framework/IO
│   ├── domain/
│   │   ├── types.ts      # Entitas & DTO
│   │   └── nutrition.ts  # BMR / TDEE / target makro (Mifflin–St Jeor)
│   └── usecases/
│       └── training-analytics.ts  # volume, e1RM, agregasi mingguan
├── lib/                  # Infrastruktur (IO)
│   ├── supabase/         # client.ts (browser) · server.ts · middleware
│   ├── openai/           # client.ts
│   ├── strava/           # OAuth + REST
│   ├── utils.ts          # cn(), formatter id-ID
│   └── demo-data.ts      # data contoh (ganti dengan query Supabase)
├── components/           # UI (layout, ui, charts)
└── app/                  # App Router (pages + /api routes)
```

Prinsip: `core/` tidak bergantung pada apa pun. `lib/` & `app/` bergantung ke `core/`, bukan sebaliknya. Logika bisnis murni bisa diuji tanpa mock.

---

## 🚀 Mulai cepat

```bash
# 1. Install dependency
npm install

# 2. Salin environment
cp .env.example .env.local
# lalu isi nilainya (lihat di bawah)

# 3. Jalankan
npm run dev          # http://localhost:3000
```

Perintah lain: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

---

## 🔐 Environment variables

Isi `.env.local`:

| Variable | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Jangan pakai prefix `NEXT_PUBLIC_` |
| `OPENAI_API_KEY` | API key OpenAI |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET` | Dari https://www.strava.com/settings/api |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` (dev) / URL Vercel (prod) |

---

## 🗄️ Setup Supabase

1. Buat project di https://supabase.com.
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`, jalankan. Ini membuat tabel (`profiles`, `workouts`, `meal_plans`, `progress_logs`, `nutrition_chats`, `strava_tokens`), Row Level Security per-pemilik, dan trigger auto-buat profil saat user daftar.
3. Aktifkan **Authentication → Email** (atau provider lain).

> Schema aman dijalankan ulang (policy & trigger pakai `drop ... if exists`).

### Menyambungkan data nyata

Saat ini halaman membaca `src/lib/demo-data.ts` agar langsung tampil. Ganti dengan query Supabase, contoh (Server Component):

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: workouts } = await supabase
  .from("workouts")
  .select("*")
  .order("performed_at", { ascending: false });
```

Catatan: kolom JSONB `exercises`/`days`/`targets` dipetakan ke tipe di `core/domain/types.ts`.

---

## 🏃 Setup Strava OAuth

1. Buat app di https://www.strava.com/settings/api.
2. **Authorization Callback Domain**: `localhost` (dev) lalu domain Vercel (prod).
3. Alur: tombol **Hubungkan** di `/progress` → `GET /api/strava` (set cookie state + redirect ke Strava) → `GET /api/strava/callback` (verifikasi state, tukar code, simpan token ke `strava_tokens`).

Token diakses fungsi di `src/lib/strava/client.ts` (`fetchRecentActivities`, `refreshAccessToken`). Refresh token jika `expires_at` < waktu sekarang.

---

## 📱 PWA / install ke Home Screen

- `public/manifest.json` + `public/sw.js` (didaftarkan oleh `ServiceWorkerRegister`).
- **iOS**: Safari → Share → *Add to Home Screen*.
- **Android**: Chrome akan menampilkan prompt *Install* otomatis.
- Ikon ada di `public/icons/` (sudah ter-generate; ganti dengan brand-mu bila perlu).

> Service worker hanya aktif di production build (`npm run build && npm start`) atau di Vercel — bukan di mode dev.

---

## ▲ Deploy ke Vercel

1. Push repo ke GitHub.
2. **Import** ke Vercel (framework Next.js terdeteksi otomatis).
3. Tambahkan semua environment variable di **Project → Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_APP_URL` ke URL produksi (mis. `https://bodyfit.vercel.app`).
5. Update **Strava callback domain** ke domain produksi.
6. Deploy.

---

## ⚠️ Catatan & langkah lanjutan

- **Belum ada UI login/signup.** Tambahkan halaman auth dengan `@supabase/ssr` lalu lindungi route via `middleware.ts`.
- `demo-data.ts` masih dipakai — ganti dengan query Supabase nyata (lihat di atas). Cari komentar `// TODO`.
- AI route non-streaming demi keandalan; bisa di-upgrade ke streaming dengan Vercel AI SDK bila perlu.
- Bukan nasihat medis — sertakan disclaimer untuk pengguna dengan kondisi kesehatan tertentu.
