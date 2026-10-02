/* =========================================================
   RPG SMK PINTAR
   GAME EDUKASI RPL - SMK 17 MUNCAR
   BAGIAN 1: CONFIG, STATE, API, DAN BANK SOAL
   ========================================================= */

const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbxLqOWDGYNOkjDgxknnlc2t5yyRvUJLV9X2sWoiwLs7K2oWtCuRQ2gOpTSCAaKmBmrnvA/exec",

  SCHOOL_NAME: "SMK 17 Muncar",
  GAME_NAME: "RPG SMK PINTAR"
};


/* =========================================================
   HELPER DOM
   ========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => [
  ...document.querySelectorAll(selector)
];


/* =========================================================
   DEFAULT PROGRESS
   ========================================================= */

const DEFAULT_PROGRESS = {
  level: 1,
  score: 0,
  stars: 0,
  completed: []
};


/* =========================================================
   STATE GAME
   ========================================================= */

const state = {

  user: JSON.parse(
    localStorage.getItem("rpgUser") || "null"
  ),

  progress: JSON.parse(
    localStorage.getItem("rpgProgress") ||
    JSON.stringify(DEFAULT_PROGRESS)
  )

};


/* =========================================================
   NORMALISASI PROGRESS
   ========================================================= */

function normalizeProgress(p) {

  return {

    level: Math.max(
      1,
      Math.min(
        53,
        Number(p?.level) || 1
      )
    ),

    score: Math.max(
      0,
      Number(p?.score) || 0
    ),

    stars: Math.max(
      0,
      Number(p?.stars) || 0
    ),

    completed:
      Array.isArray(p?.completed)
        ? p.completed
            .map(Number)
            .filter(
              n => n >= 1 && n <= 53
            )
        : []

  };

}


state.progress =
  normalizeProgress(state.progress);


/* =========================================================
   SIMPAN STATE
   ========================================================= */

function saveState() {

  localStorage.setItem(
    "rpgUser",
    JSON.stringify(state.user)
  );

  localStorage.setItem(
    "rpgProgress",
    JSON.stringify(state.progress)
  );

  if (state.user?.username) {

    localStorage.setItem(
      "progress_" + state.user.username,
      JSON.stringify(state.progress)
    );

  }

}


/* =========================================================
   PESAN
   ========================================================= */

function msg(id, text) {

  const element = $("#" + id);

  if (element) {

    element.textContent =
      text || "";

  }

}


/* =========================================================
   HASH PASSWORD
   ========================================================= */

async function sha256(text) {

  const buffer =
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text)
    );

  return [
    ...new Uint8Array(buffer)
  ]
    .map(
      x =>
        x.toString(16)
         .padStart(2, "0")
    )
    .join("");

}


/* =========================================================
   GOOGLE APPS SCRIPT API
   ========================================================= */

async function api(action, data = {}) {

  if (
    !CONFIG.GOOGLE_APPS_SCRIPT_URL ||
    CONFIG.GOOGLE_APPS_SCRIPT_URL.includes("GANTI")
  ) {

    return {
      ok: true,
      offline: true
    };

  }


  try {

    const response =
      await fetch(
        CONFIG.GOOGLE_APPS_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify({
            action,
            ...data
          })
        }
      );


    const text =
      await response.text();


    try {

      return JSON.parse(text);

    } catch {

      return {
        ok: false,
        error:
          "Respons Apps Script bukan JSON."
      };

    }

  } catch (error) {

    console.warn(
      "Google Sheets sync gagal:",
      error
    );

    return {
      ok: false,
      error: error.message
    };

  }

}


/* =========================================================
   BANK SOAL KELAS X
   ========================================================= */

const quizBanks = {

  X: [

    [
      "Algoritma",

      "Urutan langkah logis dan sistematis " +
      "untuk menyelesaikan masalah disebut ...",

      [
        "Algoritma",
        "Database",
        "Compiler",
        "Browser"
      ],

      0
    ],


    [
      "Variabel",

      "Manakah deklarasi variabel JavaScript " +
      "yang benar?",

      [
        "let nama = 'Ani';",
        "var = nama;",
        "nama let;",
        "string nama;"
      ],

      0
    ],


    [
      "HTML",

      "Tag HTML untuk membuat tautan adalah ...",

      [
        "<a>",
        "<link>",
        "<url>",
        "<href>"
      ],

      0
    ],


    [
      "CSS",

      "Properti CSS untuk mengubah warna teks adalah ...",

      [
        "color",
        "font-color",
        "text-color",
        "foreground"
      ],

      0
    ],


    [
      "Flowchart",

      "Simbol belah ketupat pada flowchart " +
      "digunakan untuk ...",

      [
        "Keputusan/percabangan",
        "Proses",
        "Input",
        "Output"
      ],

      0
    ],


    [
      "Git",

      "Perintah Git untuk melihat status " +
      "perubahan adalah ...",

      [
        "git status",
        "git open",
        "git check",
        "git scan"
      ],

      0
    ],


    [
      "Debugging",

      "Proses mencari dan memperbaiki " +
      "kesalahan program disebut ...",

      [
        "Debugging",
        "Rendering",
        "Hosting",
        "Parsing"
      ],

      0
    ],


    [
      "Database",

      "Data dalam tabel baris dan kolom " +
      "cocok dengan model ...",

      [
        "Relasional",
        "Linear",
        "Grafis",
        "Audio"
      ],

      0
    ],


    [
      "JavaScript",

      "Fungsi JavaScript untuk menampilkan " +
      "pesan di console adalah ...",

      [
        "console.log()",
        "print.console()",
        "log.console()",
        "show()"
      ],

      0
    ],


    [
      "Keamanan",

      "Kata sandi yang kuat sebaiknya ...",

      [
        "Panjang dan unik",
        "Sama dengan username",
        "Dibagikan ke teman",
        "Menggunakan 123456"
      ],

      0
    ]

  ],


  /* =======================================================
     BANK SOAL KELAS XI
     ======================================================= */

  XI: [

    [
      "OOP",

      "Konsep OOP yang menyembunyikan " +
      "detail implementasi disebut ...",

      [
        "Encapsulation",
        "Inheritance",
        "Looping",
        "Routing"
      ],

      0
    ],


    [
      "SQL",

      "Perintah SQL untuk mengambil data adalah ...",

      [
        "SELECT",
        "PUSH",
        "TAKE",
        "GETALL"
      ],

      0
    ],


    [
      "API",

      "API umumnya digunakan untuk ...",

      [
        "Komunikasi antar sistem",
        "Menggambar ikon",
        "Mengompres gambar",
        "Mengganti monitor"
      ],

      0
    ],


    [
      "GitHub",

      "Repository digunakan untuk ...",

      [
        "Menyimpan dan mengelola kode",
        "Mengedit foto saja",
        "Membuat password",
        "Menghapus internet"
      ],

      0
    ],


    [
      "Responsive",

      "Teknik agar tampilan menyesuaikan " +
      "ukuran layar disebut ...",

      [
        "Responsive design",
        "Static design",
        "Pixel lock",
        "Fixed screen"
      ],

      0
    ],


    [
      "JSON",

      "Format data yang umum digunakan API adalah ...",

      [
        "JSON",
        "DOCX",
        "MP3",
        "EXE"
      ],

      0
    ],


    [
      "HTTP",

      "Kode HTTP 404 berarti ...",

      [
        "Resource tidak ditemukan",
        "Berhasil",
        "Server sedang dibuat",
        "Login berhasil"
      ],

      0
    ],


    [
      "MVC",

      "Dalam MVC, huruf M berarti ...",

      [
        "Model",
        "Main",
        "Module",
        "Markup"
      ],

      0
    ],


    [
      "Normalisasi",

      "Tujuan normalisasi database antara lain ...",

      [
        "Mengurangi redundansi data",
        "Memperbesar duplikasi",
        "Menghapus primary key",
        "Memperlambat query"
      ],

      0
    ],


    [
      "Testing",

      "Pengujian unit berfokus pada ...",

      [
        "Bagian/unit kecil program",
        "Seluruh jaringan internet",
        "Desain logo",
        "Hardware saja"
      ],

      0
    ]

  ],


  /* =======================================================
     BANK SOAL KELAS XII
     ======================================================= */

  XII: [

    [
      "Arsitektur",

      "Pemisahan frontend dan backend membantu ...",

      [
        "Memisahkan tanggung jawab sistem",
        "Menghilangkan database",
        "Menghapus testing",
        "Mengurangi keamanan"
      ],

      0
    ],


    [
      "Deployment",

      "Deployment adalah proses ...",

      [
        "Menempatkan aplikasi agar dapat digunakan",
        "Menulis algoritma di kertas",
        "Menghapus source code",
        "Membuat kabel"
      ],

      0
    ],


    [
      "CI/CD",

      "CI/CD membantu mengotomatisasi ...",

      [
        "Build, test, dan delivery/deployment",
        "Pembuatan keyboard",
        "Desain poster",
        "Pengisian baterai"
      ],

      0
    ],


    [
      "Security",

      "Praktik menyimpan password yang tepat adalah ...",

      [
        "Hashing dengan algoritma yang sesuai",
        "Plain text",
        "Di URL",
        "Di nama file"
      ],

      0
    ],


    [
      "SQL Injection",

      "Salah satu pencegahan SQL injection adalah ...",

      [
        "Parameterized query/prepared statement",
        "Menambah warna tombol",
        "Menghapus CSS",
        "Mematikan monitor"
      ],

      0
    ],


    [
      "Version Control",

      "Branch pada Git berguna untuk ...",

      [
        "Mengembangkan perubahan secara terpisah",
        "Menghapus repository",
        "Mengganti bahasa komputer",
        "Membuat database otomatis"
      ],

      0
    ],


    [
      "Cloud",

      "Cloud computing memungkinkan ...",

      [
        "Pemanfaatan sumber daya komputasi melalui jaringan",
        "Hanya menyimpan file di flashdisk",
        "Tanpa jaringan sama sekali",
        "Menghapus server"
      ],

      0
    ],


    [
      "Agile",

      "Scrum merupakan ...",

      [
        "Framework pengembangan produk secara iteratif",
        "Bahasa pemrograman",
        "Database",
        "Browser"
      ],

      0
    ],


    [
      "UX",

      "UX berfokus pada ...",

      [
        "Pengalaman pengguna",
        "Ukuran hard disk",
        "Kecepatan CPU saja",
        "Nama domain saja"
      ],

      0
    ],


    [
      "Portfolio",

      "Portofolio RPL yang baik sebaiknya menunjukkan ...",

      [
        "Proyek, proses, dan kemampuan yang nyata",
        "Hanya foto diri",
        "Password akun",
        "Nilai tanpa karya"
      ],

      0
    ]

  ]

};


/* =========================================================
   BANK REFLEKSI LEVEL 51 - 53
   ========================================================= */

const essayBanks = {

  51: [
    "Harapan",

    "Apa harapan jujur kamu selama belajar " +
    "di SMK 17 Muncar, khususnya selama menjadi siswa RPL?"
  ],


  52: [
    "Keinginan",

    "Apa keinginan atau cita-cita yang ingin " +
    "kamu capai setelah memilih program keahlian RPL? " +
    "Ceritakan alasannya."
  ],


  53: [
    "Pengembangan",

    "Apa yang ingin kamu kembangkan di sekolah " +
    "atau di lingkungan sekitar dengan kemampuan " +
    "RPL yang kamu miliki? Tuliskan ide dan langkah sederhananya."
  ]

};
