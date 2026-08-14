# Auto Post Discord — Project Notes

Bot auto-post pesan ke Discord via web UI. Tema dark ala Discord (#313338 + blurple #5865f2), font Inter, ikon Lucide, deploy gratis ke Render.

## Flow
1. `/` → `index.html` → login dengan password `outcast` (disimpan flag `apd_logged` di localStorage) → redirect ke `/setup`
2. `/setup` → `config.html` → form: Auth Token, Pesan, Channel ID, Delay → Save Config → config masuk ke tabel
3. Tiap config punya tombol Start/Stop mandiri
4. Saat Start → POST ke `https://discord.com/api/v10/channels/{channelID}/messages` dengan header `Authorization: {token}`
5. Realtime logs menampilkan status sukses/gagal

## Struktur File
- `index.html` — halaman login (password outcast)
- `config.html` — halaman setup (form + tabel config + logs)
- `app.js` — Express server, simpan config ke `db.json` per token
- `db.json` — penyimpanan config (gitignored, berisi token)
- `Procfile` — `web: node app.js`
- `render.yaml` — config deploy Render (free tier)

## API Endpoints
- `POST /save-auth-token` — simpan token (legacy)
- `POST /save-configs` — body `{token, configs[]}` → simpan ke db.json[token].configs
- `GET /load-configs?token=...` → ambil configs
- `POST /check-token` — body `{token}` → cek validitas via Discord API `/users/@me`
- `POST /save-auto-post-state` — body `{token, state}`

## Troubleshooting
- **Icon Lucide tidak muncul**: pastikan `lucide.createIcons()` dipanggil setelah elemen dengan `data-lucide` ada di DOM. Gunakan `requestAnimationFrame` setelah `prepend`/`appendChild`.
- **Tidak nge-post**: cek token valid (badge hijau), channel ID benar, delay ≥ 5ms. Cek console browser (F12) untuk error fetch.
- **Logs kosong**: pastikan `logMessage()` dipanggil dari `sendNow()`. Cek network tab untuk request ke discord.com.
- **Config hilang setelah refresh**: config disimpan di server per token (db.json). Pastikan token sama saat load.

## Deploy
Push ke `main` branch → Render auto-deploy (baca render.yaml). Free tier tidur ~15 menit tanpa traffic.
