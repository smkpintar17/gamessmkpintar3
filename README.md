# GAMES INTERAKTIF SMK PINTAR
### SMK 17 MUNCAR — Program Keahlian Rekayasa Perangkat Lunak (RPL)

## Fitur
- Daftar: Nama Lengkap, X RPL / XI RPL / XII RPL, username, password.
- Setelah daftar langsung login otomatis.
- 20 level game 2D dengan tingkat kesulitan bertahap.
- Setiap level 1–20 memiliki soal RPL setelah gameplay.
- Level 21–23 adalah level bonus/refleksi berbasis esai.
- Jawaban refleksi: harapan untuk SMK 17 Muncar, ide pengembangan RPL, dan rencana masa depan.
- Penyimpanan progres dan skor pada browser.
- Integrasi Google Sheets melalui Google Apps Script.
- Responsif untuk HP, tablet, laptop, dan desktop.
- Siap GitHub Pages.

## Struktur
- index.html
- style.css
- script.js
- google-apps-script.gs

## Upload GitHub
1. Buat repository baru, misalnya `games-interaktif-smk-pintar`.
2. Upload keempat file.
3. Settings > Pages > Deploy from branch > main > /root.
4. Buka URL GitHub Pages.

## Google Sheets
Ikuti petunjuk di bagian atas `google-apps-script.gs`, kemudian salin URL Web App ke:
`CONFIG.SHEET_WEB_APP_URL` di `script.js`.

## Catatan penting
Versi ini menyimpan password dalam bentuk hash sederhana di localStorage untuk kebutuhan game/demo, bukan sistem autentikasi sekolah tingkat produksi. Untuk penggunaan resmi sekolah dengan akun sensitif, gunakan backend/authentication yang aman.

## Modifikasi game
Mesin gameplay 2D berada pada fungsi `startCanvasGame()` di `script.js`. Level, soal, pilihan jawaban, dan tingkat kesulitan berada pada `levelData`. Level 21–23 berada pada `bonusData`.
