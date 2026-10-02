# RPG SMK PINTAR

Game edukatif 2D bergaya Pac-Man untuk peserta didik RPL SMK 17 Muncar.

## Fitur
- Login dan registrasi nama lengkap, kelas X RPL / XI RPL / XII RPL.
- Setelah registrasi, siswa langsung masuk ke game.
- 50 level dengan labirin yang berubah dan tingkat kesulitan bertahap.
- Setelah setiap level muncul 3 soal sesuai tingkat kelas.
- Level 51–53 adalah level refleksi/esai.
- Refleksi:
  - 51: harapan selama belajar di SMK 17 Muncar.
  - 52: keinginan/cita-cita setelah memilih RPL.
  - 53: hal yang ingin dikembangkan dengan kemampuan RPL.
- Progress dasar tersimpan di browser.
- Opsional sinkronisasi ke Google Sheets melalui Google Apps Script.
- Responsive/mobile-friendly: tombol D-pad + keyboard.
- Bisa di-host di GitHub Pages.

## Instalasi GitHub Pages
1. Upload `index.html`, `style.css`, dan `app.js` ke repository.
2. Aktifkan Settings -> Pages -> Deploy from branch.
3. Buka URL GitHub Pages.

## Integrasi Google Sheets
1. Buat Google Spreadsheet.
2. Extensions -> Apps Script.
3. Salin isi `Code.gs` ke Apps Script.
4. Isi `SHEET_ID`.
5. Jalankan fungsi `setup()` sekali untuk membuat tab Users, Progress, Answers.
6. Deploy -> New deployment -> Web app.
7. Execute as: Me.
8. Who has access: Anyone.
9. Salin URL `/exec`.
10. Masukkan URL tersebut ke `CONFIG.GOOGLE_APPS_SCRIPT_URL` di `app.js`.
11. Upload ulang `app.js` ke GitHub.

### Catatan keamanan
Versi ini cocok untuk prototipe/kegiatan sekolah. Password dikirim sebagai SHA-256 dari browser, tetapi sistem client-side + Apps Script tetap bukan sistem autentikasi produksi. Untuk data siswa sungguhan, batasi akses Spreadsheet, gunakan akun sekolah/SSO atau backend dengan autentikasi yang lebih kuat, dan ikuti kebijakan privasi sekolah.

## Mengubah soal
Soal berada di `quizBanks` dalam `app.js`. Terdapat bank terpisah untuk X, XI, XII.
Jumlah soal yang tampil per level adalah 3, dipilih berputar dari bank soal.

## Struktur
- index.html
- style.css
- app.js
- Code.gs
- README.md
