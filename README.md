# RPG SMK PINTAR

Game edukatif 2D berbasis web untuk peserta didik Program Keahlian Rekayasa Perangkat Lunak (RPL) SMK 17 Muncar.

## Fitur
- Registrasi & login username/password.
- Pilihan kelas X RPL, XI RPL, XII RPL.
- Login otomatis pada perangkat yang sama.
- 50 level arcade 2D dengan tingkat kesulitan bertahap.
- Setelah setiap level 1–50: soal RPL pilihan ganda.
- Level 51–53: bonus/refleksi esai.
- Refleksi:
  1. Harapan/keinginan untuk SMK 17 Muncar.
  2. Hal yang ingin dikembangkan lewat RPL.
  3. Target/komitmen belajar RPL.
- Penyimpanan progres lokal (localStorage).
- Opsional sinkronisasi data ke Google Sheets melalui Google Apps Script.
- Tanpa library eksternal, sehingga mudah di-host di GitHub Pages.

## Jalankan lokal
Buka `index.html` di browser. Untuk pengalaman terbaik gunakan server lokal:
```bash
python -m http.server 8000
```
lalu buka `http://localhost:8000`.

## Deploy GitHub Pages
1. Buat repository baru.
2. Upload seluruh isi folder proyek.
3. Settings → Pages → Deploy from branch.
4. Pilih branch `main`, folder `/ (root)`.
5. Buka URL GitHub Pages yang diberikan.

## Integrasi Google Sheets
1. Buat Google Sheet kosong, misalnya `RPG SMK PINTAR - Data`.
2. Extensions → Apps Script.
3. Ganti kode dengan isi `docs/Code.gs`.
4. Deploy → New deployment → Web app.
5. Execute as: Me.
6. Who has access: Anyone (atau sesuai kebijakan sekolah).
7. Salin URL Web App.
8. Buka `config.js`, isi:
```js
SHEETS_API_URL: "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```
9. Commit perubahan ke GitHub.

**Catatan privasi:** Password pada contoh ini hanya disimpan lokal untuk login perangkat. Jangan kirim password siswa ke Google Sheets. Data yang dikirim ke Sheets hanya username/nama/kelas, progres, skor, jawaban kuis, dan refleksi.

## Struktur
- `index.html` — tampilan aplikasi
- `style.css` — UI responsif
- `game.js` — engine game, auth, progres, sinkronisasi
- `questions.js` — bank soal
- `config.js` — konfigurasi sekolah dan Google Sheets
- `docs/Code.gs` — endpoint Google Apps Script
