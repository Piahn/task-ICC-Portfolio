# 🚀 Setup Guide - Salmoon (Vite Edition)

Panduan instalasi, konfigurasi environment, arsitektur proyek, dan cara menjalankan **Salmoon** versi **Vite + React Router + Tailwind CSS v4**.

---

## 📋 Daftar Isi

1. [Teknologi Utama (Stack)](#-teknologi-utama-stack)
2. [Prasyarat Sistem](#-prasyarat-sistem)
3. [Variabel Lingkungan (Environment Variables)](#-variabel-lingkungan-environment-variables)
4. [Detail Konfigurasi GitHub Access Token](#-detail-konfigurasi-github-access-token)
5. [Detail Konfigurasi Supabase (Database & Auth)](#-detail-konfigurasi-supabase-database--auth)
6. [Instalasi & Menjalankan Proyek](#-instalasi--menjalankan-proyek)
7. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
8. [Arsitektur & Kompatibilitas](#-arsitektur--kompatibilitas)
9. [Git Backup & Rollback](#-git-backup--rollback)

---

## ⚡ Teknologi Utama (Stack)

- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **UI Library**: [React 18](https://react.dev/)
- **Routing**: [React Router 6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan plugin `@tailwindcss/vite`
- **Animation**: [Motion](https://motion.dev/) (Framer Motion v12)
- **Content Engine**: [Velite](https://velite.js.org/) (Static MDX compiler dengan Rehype & Shiki)
- **Komponen UI**: [Radix UI](https://www.radix-ui.com/), [CMDK](https://cmdk.paco.me/), [Vaul](https://vaul.emilkowal.ski/), [Sonner](https://sonner.emilkowal.ski/)
- **Backend / Database**: [Supabase Client](https://supabase.com/) & [TanStack Query v5](https://tanstack.com/query/latest)
- **Package Manager**: [Bun](https://bun.sh/) (Rekomendasi) atau Node.js + npm/pnpm

---

## 💻 Prasyarat Sistem

Pastikan salah satu runtime berikut terpasang di komputer Anda:
- **Bun**: Versi `1.0.0` atau lebih baru (`bun --version`) *(Sangat direkomendasikan)*
- **Node.js**: Versi `18.0.0` atau lebih baru (`node -v`)

---

## 🔐 Variabel Lingkungan (Environment Variables)

Buat file `.env` di root direktori proyek (`/root/salmoon/.env`) dengan menyalin dari `.env.example`:

```bash
cp .env.example .env
```

Isi file `.env` dengan format berikut:

```env
# URL dasar aplikasi
NEXT_PUBLIC_BASE_URL=http://localhost:3002

# Konfigurasi Supabase (Untuk Guestbook, Sticky Note Canvas, & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-supabase-anon-key...

# GitHub Personal Access Token (Untuk GitHub Contribution Calendar / Activity)
NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_personal_access_token
```

---

## 🔑 Detail Konfigurasi GitHub Access Token

Variabel `NEXT_PUBLIC_GITHUB_TOKEN` digunakan oleh API GraphQL GitHub (`https://api.github.com/graphql`) untuk mengambil data kalender kontribusi (*contribution activity calendar*) pengguna.

### Langkah-langkah Pembuatan Token GitHub:
1. Buka [GitHub Tokens Settings](https://github.com/settings/tokens).
2. Klik tombol **Generate new token** lalu pilih **Generate new token (classic)**.
3. Masukkan deskripsi pada kolom **Note**, misalnya: `Portfolio Contribution Calendar`.
4. Pilih masa berlaku (**Expiration**), misalnya `90 days` atau `No expiration` (jika untuk keperluan personal).
5. **Scopes (Izin Akses)**:
   - **Untuk profil publik (Rekomendasi)**: Cukup centang `read:user` (User > read:user). Bahkan tanpa mencentang scope tambahan pun, API GraphQL GitHub sudah dapat membaca kontribusi publik akun Anda.
   - **Untuk menyertakan repositori privat**: Jika Anda ingin grafik kontribusi juga menghitung commit pada repository privat milik Anda, centang scope `repo` (*Full control of private repositories*).
6. Gulir ke bawah dan klik tombol hijau **Generate token**.
7. Salin token yang diawali dengan `ghp_...` dan tempelkan ke file `.env`:
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```

---

## ⚡ Detail Konfigurasi Supabase (Database & Auth)

Supabase digunakan untuk fitur **Guestbook**, **Sticky Note Canvas** (`/note`), serta **Autentikasi Pengunjung** (OAuth GitHub & Google).

### 1. Dapatkan URL & Anon Key:
1. Buat akun atau buka project di [Supabase Dashboard](https://supabase.com/dashboard).
2. Masuk ke menu **Project Settings** (ikon gear di sidebar kiri bawah) > **API**.
3. Di bagian **Project URL**, salin URL project Anda (misal: `https://xyzprojectid.supabase.co`) -> masukkan ke `NEXT_PUBLIC_SUPABASE_URL`.
4. Di bagian **Project API keys**, salin key **`anon` `public`** (string panjang diawali `eyJ...`) -> masukkan ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 2. Konfigurasi Redirect URL (Wajib untuk Login):
1. Buka menu **Authentication** > **URL Configuration** di Supabase Dashboard.
2. Pada **Site URL**, isi URL utama lokal:
   ```text
   http://localhost:3002
   ```
3. Pada **Redirect URLs**, tambahkan URL callback aplikasi:
   ```text
   http://localhost:3002/auth/callback
   http://localhost:3000/auth/callback
   ```
4. Klik **Save**.

### 3. Setup OAuth GitHub (Agar tombol "Login with GitHub" Berfungsi):
1. Buka [GitHub Developer Settings - OAuth Apps](https://github.com/settings/developers).
2. Klik **New OAuth App**:
   - **Application name**: `Piahn Wijaya Portfolio`
   - **Homepage URL**: `http://localhost:3002`
   - **Authorization callback URL**: Salin dari Supabase Dashboard (**Authentication > Providers > GitHub > Callback URL (for OAuth)**, formatnya: `https://<id-project>.supabase.co/auth/v1/callback`).
3. Klik **Register application**.
4. Salin **Client ID**, lalu klik **Generate a new client secret** untuk menyalin **Client Secret**.
5. Kembali ke Supabase Dashboard > **Authentication** > **Providers** > **GitHub**:
   - Aktifkan toggle **Enable GitHub**.
   - Masukkan **Client ID** dan **Client Secret**.
   - Klik **Save**.

### 4. Eksekusi Skema Database (SQL Script):
Buka menu **SQL Editor** di Supabase Dashboard, buat **New query**, lalu salin dan jalankan (*Run*) script berikut:

```sql
-- 1. Buat Enum Warna untuk Note
CREATE TYPE color AS ENUM ('red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink');

-- 2. Buat Tabel Profile (Data Pengguna Login)
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY,
  name TEXT,
  avatar_url TEXT
);

-- 3. Buat Tabel Guestbook
CREATE TABLE IF NOT EXISTS public.guestbook (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  parent_id BIGINT REFERENCES public.guestbook(id) ON DELETE CASCADE
);

-- 4. Buat Tabel Note
CREATE TABLE IF NOT EXISTS public.note (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  color color DEFAULT 'yellow'::color,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Aktifkan Row Level Security (RLS)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan RLS (Profile)
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profile FOR SELECT USING (true);

CREATE POLICY "Users can insert/update their own profile." 
  ON public.profile FOR ALL USING (auth.uid()::text = id);

-- 7. Kebijakan RLS (Guestbook)
CREATE POLICY "Guestbook entries are viewable by everyone." 
  ON public.guestbook FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert guestbook entries." 
  ON public.guestbook FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own guestbook entries." 
  ON public.guestbook FOR DELETE USING (auth.uid()::text = user_id);

-- 8. Kebijakan RLS (Note)
CREATE POLICY "Notes are viewable by everyone." 
  ON public.note FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert notes." 
  ON public.note FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own notes." 
  ON public.note FOR DELETE USING (auth.uid()::text = user_id);

-- 9. Trigger Otomatis Sinkronisasi Profile dari Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id, name, avatar_url)
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'user_name', 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🛠️ Instalasi & Menjalankan Proyek

### 1. Masuk ke Direktori Proyek
```bash
cd /root/salmoon
```

### 2. Pasang Seluruh Dependensi
```bash
bun install
```
*(Atau menggunakan npm: `npm install`)*

### 3. Jalankan Mode Development
```bash
bun run dev
```
Perintah ini akan menjalankan dua proses sekaligus secara otomatis via `concurrently`:
1. **Velite Dev**: Mengompilasi dan mengawasi file markdown MDX di folder `content/` ke `.velite/`.
2. **Vite Dev Server**: Menjalankan dev server lokal dengan instan Hot Module Replacement (HMR) di `http://localhost:3000`.

### 4. Build untuk Production
```bash
bun run build
```
Menjalankan kompilasi konten Velite (`bun run velite:build`) kemudian mem-bundle seluruh aset web ke folder `dist/` menggunakan Vite (`vite build`).

### 5. Preview Hasil Build Production
```bash
bun run preview
```
Menjalankan HTTP server lokal untuk menguji build produksi di folder `dist/`.

---

## 📂 Struktur Direktori Proyek

```text
/root/salmoon/
├── action/              # Client actions & helpers (Calendar, Guestbook, Note)
├── components/          # Komponen UI yang dapat digunakan kembali
│   ├── form/            # Formulir (Contact, Guestbook)
│   ├── lab/             # Live UI experiment & micro-interaction components
│   ├── motion/          # Wrapper animasi physics (SectionWrapper, CodeWrapper)
│   ├── section/         # Bagian layout halaman (Hero, Profile, CTA, Project)
│   ├── shared/          # Komponen global (Dock, Footer, Command Palette, MDX)
│   └── ui/              # Primitive UI components (Button, Dialog, Tabs, etc.)
├── content/             # Sumber konten MDX (post/, project/, swift/)
├── hooks/               # Custom React hooks (useCanvasDrag, useStickyNotes, dll.)
├── lib/                 # Utilitas, registry data, helper tanggal & format
│   ├── compat/          # Drop-in compatibility shims untuk Next.js
│   │   ├── next-link.tsx        # Shim <Link> ke react-router-dom
│   │   ├── next-image.tsx       # Shim <Image> ke <img> tag
│   │   ├── next-navigation.ts   # Shim useRouter, usePathname, notFound
│   │   ├── next-dynamic.tsx     # Shim dynamic() ke React.lazy + Suspense
│   │   └── next-font.ts         # Shim class font Google (Plus Jakarta & Caveat)
│   └── read-file.ts     # Client-safe code reader via Vite import.meta.glob
├── pages/               # Komponen routing halaman React Router
│   ├── layout.tsx       # Root layout (Top gradient, Dock, Footer, Command)
│   ├── home.tsx         # / (Home page)
│   ├── archive.tsx      # /archive (Career path, side projects, blogs)
│   ├── bucket-list.tsx  # /bucket-list
│   ├── contact.tsx      # /contact & /contact/success
│   ├── guestbook.tsx    # /guestbook (Komentar pengunjung via Supabase)
│   ├── lab.tsx          # /lab & /lab/:slug (Interactive UI experiments)
│   ├── material.tsx     # /material (Tools, workstation, bookmarks)
│   ├── mentorship.tsx   # /mentorship
│   ├── personal.tsx     # /personal (Top tracks & movies)
│   ├── post.tsx         # /post & /post/* (Blog MDX & Table of Contents)
│   ├── project-detail.tsx # /project/:slug (Case studies)
│   ├── swift.tsx        # /swift & /swift/* (SwiftUI experiments)
│   ├── note.tsx         # /note (Infinite draggable Cartesian canvas board)
│   └── auth-callback.tsx# /auth/callback (OAuth Supabase session exchange)
├── public/              # Aset statis (fonts, images, icons, robots.txt, favicon)
├── styles/              # Stylesheet Tailwind CSS v4 (globals.css, mdx.css, dll.)
├── supabase/            # Client Supabase (@supabase/supabase-js)
├── App.tsx              # Router sentral aplikasi
├── main.tsx             # Entry point React 18 root
├── index.html           # Entry point HTML Vite
├── vite.config.ts       # Konfigurasi plugin & path aliases Vite
├── velite.config.ts     # Konfigurasi schema & transformer Velite MDX
└── package.json         # Konfigurasi dependensi & npm scripts
```

---

## 🧠 Arsitektur & Kompatibilitas

### 1. Zero-Breaking Next.js Compatibility Layer
Seluruh komponen UI dari Next.js tetap mempertahankan sintaks aslinya:
- Import `next/link` secara otomatis diarahkan ke `lib/compat/next-link.tsx`.
- Import `next/image` diarahkan ke `lib/compat/next-image.tsx`.
- Import `next/navigation` diarahkan ke `lib/compat/next-navigation.ts`.
- Import `next/dynamic` diarahkan ke `lib/compat/next-dynamic.tsx`.
- Import `next/font/google` diarahkan ke `lib/compat/next-font.ts`.

Semua alias ini diatur secara otomatis di [vite.config.ts](file:///root/salmoon/vite.config.ts) dan [tsconfig.json](file:///root/salmoon/tsconfig.json).

### 2. Penanganan Aset Statis di Folder `public/`
Di Next.js, gambar sering di-import langsung dari `@/public/...`. Di Vite, file di dalam `public/` dilayani langsung di root URL:
- Gunakan string path langsung seperti `"/images/places/place-1.webp"` atau `"/assets/companies/bangkit.svg"` tanpa import JavaScript.
- Komponen shim `<Image />` di `lib/compat/next-image.tsx` otomatis mendukung string path maupun object gambar.

### 3. Client-Safe Dynamic Code Reader di `/lab`
Di Next.js sebelumnya, kode sumber komponen dibaca menggunakan modul Node.js `fs.readFile`. Di Vite, fungsi di [lib/read-file.ts](file:///root/salmoon/lib/read-file.ts) menggunakan fitur bawaan Vite:
```typescript
const rawModules = import.meta.glob(
  [
    "/components/lab/**/*.tsx",
    "/components/ui/**/*.tsx",
    "/hooks/**/*.ts",
  ],
  { query: "?raw", import: "default", eager: true }
);
```
Pendekatan ini membuat tab *Source Code* di halaman `/lab/:slug` dapat dimuat seketika di browser tanpa membutuhkan server backend Node.js.

### 3. Infinite Sticky Note Canvas (`/note`)
Halaman `/note` adalah kanvas tak terbatas (Cartesian plane) di mana pengguna dapat menggeser (drag/pan), memperbesar/memperkecil (zoom), dan meletakkan catatan:
- Menggunakan hook [useCanvasDrag](file:///root/salmoon/hooks/use-canvas.ts) dan [useStickyNotes](file:///root/salmoon/hooks/use-note.ts).
- Dilengkapi **Viewport Boundary Culling** agar hanya sticky note di dalam layar yang di-render untuk menjaga frame rate 60 FPS.
- Penempatan spiral radial otomatis (`generateGridPositions`) untuk menyusun catatan baru dari pusat ke luar.

---

## 🛡️ Git Backup & Rollback

Branch versi Next.js asli tetap tersimpan utuh di repository git lokal:
- Untuk melihat daftar branch:
  ```bash
  git branch
  # Menampilkan:
  # * main
  #   backup/nextjs-original
  ```
- Jika sewaktu-waktu ingin memeriksa atau kembali ke versi Next.js:
  ```bash
  git checkout backup/nextjs-original
  ```
- Untuk kembali ke versi Vite:
  ```bash
  git checkout main
  ```
