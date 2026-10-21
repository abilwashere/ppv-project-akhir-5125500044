# RuangPENS

RuangPENS adalah aplikasi web sederhana untuk membantu mahasiswa, terutama mahasiswa baru PENS, memahami kode ruangan (misalnya PS 1.03) dan mencari petunjuk menuju ruangan tersebut.

Aplikasi ini dibuat untuk pengguna yang belum familiar dengan kode ruangan di lingkungan PENS.

## Identitas

- Nama: Nabila Putri
- NRP: 5125500044
- Kelas: 2 D3 MMB B
- Mata Kuliah: Praktikum Pemrograman Visual (TB033109)
- Tugas: Tugas 4 – Prototipe Terpadu (pengembangan dari Tugas 3 – Event Handling)

## Tautan

- Aplikasi (Netlify): https://ruangpens.netlify.app
- Repositori: Tidak dicantumkan karena aplikasi dipublikasikan melalui Netlify.

## Cara Menjalankan

1. Ekstrak folder aplikasi/.
2. Buka index.html menggunakan browser, misalnya Google Chrome.
3. Aplikasi tidak memerlukan XAMPP, PHP, atau database.

## Yang Ditambahkan di Tugas 4

1. Tiga tampilan yang saling terhubung
Menu Cari, Panduan, dan Riwayat tetap tersedia sehingga pengguna dapat berpindah tampilan tanpa terjebak di satu halaman.
- Cari: mencari ruangan melalui pilihan gedung, lantai, dan ruangan atau dengan mengetik kode ruangan. Hasil pencarian menampilkan informasi ruangan, petunjuk arah, dan denah.
- Panduan: menjelaskan cara membaca kode ruangan dan menyediakan contoh kode yang dapat dipilih untuk langsung menjalankan pencarian.
- Riwayat: menampilkan hingga lima pencarian terakhir. Kode pada riwayat dapat dipilih untuk mencari kembali.
2. Petunjuk arah
Setelah pencarian berhasil, aplikasi menampilkan informasi lokasi gedung dan lantai serta petunjuk menuju ruangan. Tombol Salin petunjuk digunakan untuk menyalin teks petunjuk agar mudah dibagikan.
3. Animasi JavaScript
Animasi JavaScript menggunakan element.animate() dan hanya mengubah transform serta opacity. Durasi animasi diatur melalui fungsi durasi(), yang mengembalikan nilai 0 ketika pengaturan prefers-reduced-motion: reduce aktif.
- Tampilan baru memudar sambil naik: muncul saat berpindah menu atau memilih contoh/riwayat; 220 ms.
- Kotak pencarian bergetar: muncul ketika input tidak valid; 280 ms.
- Kartu hasil muncul membesar sedikit: muncul setelah pencarian berhasil; 260 ms.
- Tombol salin membal: muncul saat tombol Salin petunjuk ditekan; 300 ms.
Aplikasi juga memiliki animasi dekoratif CSS. Animasi tersebut ikut dinonaktifkan ketika pengaturan pengurangan gerakan aktif.
4. Tampilan responsif
Tampilan disesuaikan untuk layar ponsel dengan lebar sekitar 400 px dan layar laptop. Ukuran menu dan tombol juga dibuat agar lebih mudah disentuh.

## Fitur dari Tugas 3

- Pencarian ruangan lewat pilihan gedung, lantai, dan ruangan.
- Pencarian dengan mengetik kode ruangan.
- Validasi input dan pesan kesalahan.
- Empty state, loading state, success state, dan error state.
- Enter sebagai pintasan untuk mencari.

## Data Ruangan

Data ruangan yang digunakan merupakan data simulasi untuk kebutuhan prototipe, bukan daftar resmi seluruh ruangan kampus. Setiap gedung memiliki jumlah lantai dan ruangan berikut:

- **PS** — Gedung Pascasarjana; 11 lantai, masing-masing 5 ruangan.
- **SAW** — Gedung SAW; 11 lantai, masing-masing 5 ruangan.
- **JJ** — Gedung D3; 3 lantai, masing-masing 5 ruangan.
- **HH** — Gedung D4; 3 lantai, masing-masing 5 ruangan.

Total terdapat 140 kode ruangan simulasi. Contoh input valid: `PS 1.03`, `SAW 2.05`, `HH 1.04`, dan `JJ 1.02`. Contoh input tidak valid: `JJ 4.02` (gedung D3 hanya memiliki 3 lantai) dan `JJ 1.06` (setiap lantai hanya memiliki ruangan 01–05).

## Event yang Digunakan

`DOMContentLoaded`, `change` (gedung, lantai), `click` (mode, menu, tombol kode, suara, salin), `input`, `mouseover`/`mouseout`, `keydown` (Enter), dan `submit`.

## Aset Media dan Sumber

- Logo: gambar; sumber yang dicatat saat pengerjaan adalah Canva (ikon location pin dan search bar).
- Bunyi ketika ruangan ditemukan: audio success.mp3; sumber yang dicatat saat pengerjaan adalah Pixabay.

Logo punya teks pengganti (`alt`) dan disembunyikan otomatis jika gagal dimuat. Audio bisa dimatikan lewat tombol Suara, dan aplikasi tetap berjalan jika audio gagal diputar.

## User Testing

- Tugas 3: dilakukan pada 21 September 2026 oleh Farhah.
- Tugas 4: hasil pengujian dicantumkan pada laporan PDF Tugas 4.

## Catatan Pengerjaan

Pengembangan navigasi pada Bagian B dibantu AI (Claude). Desain, pengembangan fitur lainnya, data dan informasi yang dimasukkan, pengujian, serta penulisan penjelasan penyebab bug dikerjakan sendiri.

## Struktur File

aplikasi/
├── index.html
├── style.css
├── script.js
├── README.md
├── aset/
│   ├── [logo]
│   └── [audio]
└── screenshot/
    ├── empty-state.png
    ├── success.png
    └── wrong-input.png