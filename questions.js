/*
  Bank soal: 50 soal pilihan ganda (satu per level) + 3 refleksi esai.
  Soal dikelompokkan menurut kelas. Anda dapat mengedit bank ini.
*/
const QUESTION_BANK = {
  X: [
    ["Apa kepanjangan dari HTML?",["HyperText Markup Language","HighText Machine Language","Hyperlink Text Management Language","Home Tool Markup Language"],0],
    ["Tag HTML untuk membuat paragraf adalah...",["<p>","<para>","<text>","<pg>"],0],
    ["CSS digunakan terutama untuk...",["Mengatur tampilan halaman web","Menyimpan database","Mengompilasi Java","Mengirim email"],0],
    ["Properti CSS untuk mengubah warna teks adalah...",["color","font-color","text-color","foreground"],0],
    ["JavaScript pada web umumnya digunakan untuk...",["Membuat interaksi dan logika di halaman","Menyimpan file BIOS","Mengganti sistem operasi","Membuat kabel jaringan"],0],
    ["Variabel JavaScript dapat dibuat dengan...",["let","make","varia","define"],0],
    ["Tipe data untuk nilai benar/salah disebut...",["Boolean","String","Float","Array"],0],
    ["Komentar satu baris JavaScript diawali dengan...",["//","<!--","##","**"],0],
    ["Git digunakan untuk...",["Version control","Menggambar UI saja","Menghapus OS","Membuat jaringan Wi-Fi"],0],
    ["Perintah Git untuk melihat status perubahan adalah...",["git status","git show-all","git changes","git inspect"],0],
    ["Algoritma adalah...",["Langkah logis untuk menyelesaikan masalah","Nama bahasa pemrograman","Jenis monitor","Aplikasi desain"],0],
    ["Flowchart digunakan untuk...",["Memvisualisasikan alur algoritma","Mengedit foto","Mengompres video","Membuat password"],0],
    ["Simbol belah ketupat pada flowchart biasanya berarti...",["Percabangan/keputusan","Mulai","Proses","Output cetak"],0],
    ["Array adalah struktur data untuk...",["Menyimpan kumpulan nilai","Mengatur warna layar","Menghubungkan Wi-Fi","Membuat domain"],0],
    ["Operator perbandingan strict equality JavaScript adalah...",["===","=","==>","<>"],0],
    ["HTTP 404 biasanya berarti...",["Resource tidak ditemukan","Server berhasil","Akses admin","Database tersambung"],0],
    ["Responsive web berarti...",["Tampilan menyesuaikan berbagai ukuran layar","Website selalu offline","Website tanpa CSS","Website hanya untuk desktop"],0]
  ],
  XI: [
    ["SQL SELECT digunakan untuk...",["Mengambil data","Menghapus tabel","Membuat password","Menggambar diagram"],0],
    ["Perintah untuk menambahkan baris data SQL adalah...",["INSERT","PUSH","APPEND ROW","ADD"],0],
    ["Primary key berfungsi sebagai...",["Identitas unik sebuah record","Warna tabel","Password database","Nama server"],0],
    ["JOIN dalam SQL digunakan untuk...",["Menggabungkan data dari tabel terkait","Menghapus database","Mengenkripsi file","Mengganti OS"],0],
    ["Normalisasi database bertujuan antara lain untuk...",["Mengurangi redundansi data","Memperbesar ukuran tabel","Menghapus relasi","Mematikan server"],0],
    ["API adalah singkatan dari...",["Application Programming Interface","Application Page Internet","Applied Program Input","Advanced Protocol Index"],0],
    ["JSON banyak digunakan untuk...",["Pertukaran data terstruktur","Menggambar logo","Mengompilasi kernel","Membuat kabel"],0],
    ["HTTP method yang umum untuk membuat resource baru adalah...",["POST","GET","READ","FETCH"],0],
    ["HTTP status 200 menunjukkan...",["Permintaan berhasil","Tidak ditemukan","Kesalahan server","Tidak diizinkan"],0],
    ["Git branch berguna untuk...",["Mengembangkan perubahan secara terpisah","Menghapus semua commit","Mematikan repository","Mengganti username OS"],0],
    ["OOP adalah singkatan dari...",["Object-Oriented Programming","Open Output Protocol","Online Object Page","Operational Order Process"],0],
    ["Encapsulation pada OOP berarti...",["Membungkus data dan perilaku dengan akses terkontrol","Menghapus semua class","Membuat database","Menjalankan browser"],0],
    ["Debugging adalah proses...",["Mencari dan memperbaiki kesalahan program","Membuat logo","Menghapus source code","Mencetak dokumen"],0],
    ["Unit testing menguji...",["Bagian kecil/fungsi program secara terisolasi","Koneksi listrik","Desain poster","Kecepatan printer"],0],
    ["Password sebaiknya disimpan pada server sebagai...",["Hash yang aman","Plain text","Nama pengguna","Komentar HTML"],0],
    ["Validasi input bertujuan untuk...",["Memastikan data sesuai aturan sebelum diproses","Mempercepat monitor","Mengganti database","Menghapus form"],0],
    ["Responsive breakpoint biasanya digunakan untuk...",["Menyesuaikan layout berdasarkan ukuran viewport","Mengenkripsi password","Menghapus CSS","Mengubah domain"],0]
  ],
  XII: [
    ["CI/CD membantu tim untuk...",["Mengotomatisasi integrasi dan pengiriman/deployment","Menggambar ikon","Membuat kabel LAN","Menghapus repository"],0],
    ["Deployment adalah...",["Proses merilis aplikasi ke lingkungan target","Menghapus source code","Membuat database secara manual saja","Membuat username"],0],
    ["Docker container membantu...",["Mengemas aplikasi beserta dependensinya secara konsisten","Mengedit foto","Membuat spreadsheet","Mengganti monitor"],0],
    ["Environment variable cocok untuk...",["Konfigurasi yang berbeda antar lingkungan","Menyimpan CSS saja","Menggambar diagram","Membuat HTML tag"],0],
    ["XSS merupakan contoh...",["Kerentanan keamanan aplikasi web","Jenis database","Bahasa pemrograman","Sistem operasi"],0],
    ["Prinsip least privilege berarti...",["Memberi hak akses seminimal yang diperlukan","Memberi semua user akses admin","Menonaktifkan login","Membuka database publik"],0],
    ["Backup berguna untuk...",["Pemulihan data saat terjadi kehilangan/kerusakan","Membuat UI","Mengubah font","Meningkatkan resolusi"],0],
    ["Load testing bertujuan mengetahui...",["Perilaku sistem di bawah beban tertentu","Warna favorit pengguna","Nama domain","Ukuran logo"],0],
    ["Git merge digunakan untuk...",["Menggabungkan perubahan dari branch","Membuat database","Membuat akun","Menghapus remote"],0],
    ["Pull request digunakan untuk...",["Mengusulkan dan meninjau perubahan kode sebelum digabung","Mengubah password Wi-Fi","Menghapus issue","Membuat folder Windows"],0],
    ["REST API umumnya menggunakan...",["HTTP methods dan resource","Kabel HDMI","BIOS","Spreadsheet formula"],0],
    ["HTTPS menambahkan...",["Enkripsi komunikasi melalui TLS","Database baru","Bahasa pemrograman","Format gambar"],0],
    ["Caching dapat membantu...",["Mengurangi waktu/biaya mengambil data berulang","Menghapus semua data","Mengganti CPU","Membuat password"],0],
    ["Scalability adalah kemampuan sistem untuk...",["Menangani pertumbuhan beban dengan tepat","Menggambar UI","Mengubah HTML menjadi PDF saja","Menghapus log"],0],
    ["Log aplikasi berguna untuk...",["Mendiagnosis kejadian dan masalah sistem","Mengganti monitor","Membuat domain","Menghapus database"],0],
    ["Code review bertujuan...",["Menilai perubahan kode untuk kualitas, keamanan, dan maintainability","Menghapus semua branch","Membuat akun email","Membeli server"],0]
  ]
};

const REFLECTIONS = [
  "Apa harapan dan keinginanmu untuk SMK 17 Muncar agar pembelajaran dan lingkungan sekolah semakin baik? Jelaskan dengan jujur.",
  "Apa yang ingin kamu kembangkan melalui Program Keahlian RPL? Jelaskan ide, keterampilan, atau proyek yang ingin kamu wujudkan.",
  "Setelah mengikuti RPG SMK PINTAR, apa satu perubahan atau target yang ingin kamu lakukan dalam belajar RPL mulai sekarang? Jelaskan alasannya."
];

function questionFor(level, className) {
  const key = className.startsWith("XII") ? "XII" : className.startsWith("XI") ? "XI" : "X";
  const bank = QUESTION_BANK[key];
  // Distribusi deterministik agar 50 level tetap memiliki soal berbeda.
  return bank[(level - 1) % bank.length];
}