# Auto Post to Discord — Web UI

Bot auto-post pesan ke channel Discord lewat antarmuka web modern. Tema gelap ala Discord, ikon **Lucide**, dan siap di-deploy gratis ke **Render**.

## Fitur

- 🎨 UI modern dark ala Discord (`#313338` + blurple `#5865f2`), font Inter, glass card
- 🧩 Ikon **Lucide** (send, plus, trash, edit, play/pause, settings, dll)
- 📝 Kelola banyak konfigurasi (pesan + channel ID + delay)
- ✅ Toggle per-config & "aktifkan semua"
- 📜 Log kirim real-time dengan status sukses/gagal
- 💾 Config tersimpan di server per token (bisa dibuka dari device mana pun)
- ☁️ Deploy gratis ke Render (free tier)

## Cara Lokal

```sh
npm i
node app
```

Buka `http://localhost:3000`, masukkan auth token Discord, lalu atur konfigurasi.

> **Catatan:** Auth token dikirim ke server dan disimpan di `db.json` per token. Jangan bagikan token ke siapa pun. Bot memposting dari sisi browser (client-side fetch ke Discord API), jadi posting berjalan selama tab terbuka.

## Deploy Gratis ke Render

1. Fork/clone repo ini ke GitHub.
2. Buka [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service** → hubungkan repo.
3. Render otomatis mendeteksi `render.yaml` (plan: `free`, start: `node app.js`).
4. Klik **Create Web Service**. Setelah build selesai, buka URL `https://<nama>.onrender.com`.
5. Masukkan auth token → atur config → klik **Mulai Otomatis**.

Render free tier akan tidur setelah ~15 menit tanpa traffic — buka ulang URL untuk membangunkannya.

## Struktur

```
index.html      # Halaman masuk (auth token)
config.html     # Halaman konfigurasi + log
app.js          # Express server (simpan config ke db.json)
db.json         # Penyimpanan config per token
Procfile        # web: node app.js
render.yaml     # Konfigurasi deploy Render
```

## Keamanan

- Jangan commit `db.json` yang berisi token.
- Token adalah kredensial akun Discord — jaga kerahasiaannya.
