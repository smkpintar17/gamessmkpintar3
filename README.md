# GAMES INTERAKTIF SMK PINTAR — Android Ready

Project ini sudah disesuaikan untuk HP Android:
- Layout mobile-first dan layar portrait.
- Kontrol game menggunakan sentuhan/touch.
- Tombol lompat, kiri, kanan berukuran besar.
- Mencegah zoom dan overscroll saat bermain.
- PWA: bisa di-install dari Chrome Android sebagai aplikasi.
- Bisa tetap digunakan sebagai website GitHub Pages.
- Progress dan skor tetap tersimpan di localStorage.
- Google Sheets tetap opsional.

## Cara memainkan di Android

### Cara 1 — GitHub Pages
Upload seluruh isi folder ini ke repository GitHub, aktifkan:
Settings → Pages → Deploy from branch → main → /root.

Buka URL GitHub Pages melalui Chrome Android.

### Cara 2 — Install seperti aplikasi
Setelah website dibuka di Chrome Android, gunakan menu browser lalu pilih **Install app / Tambahkan ke layar utama** jika tersedia. PWA membutuhkan HTTPS; GitHub Pages sudah HTTPS.

### Cara 3 — Membuat APK
Source ini adalah web/PWA, bukan APK native. Untuk APK, project dapat dibungkus menggunakan Android Studio + WebView atau Capacitor. Jangan membuka `index.html` langsung dari `file://` jika ingin fitur PWA/service worker; gunakan HTTPS.

## Struktur
- index.html
- style.css
- script.js
- manifest.webmanifest
- sw.js
- google-apps-script.gs

## Catatan
Autentikasi pada project ini masih untuk demo pembelajaran dan menyimpan data di perangkat/browser. Untuk akun siswa resmi, gunakan backend/authentication yang aman.
