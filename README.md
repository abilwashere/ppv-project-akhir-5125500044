# RuangPENS

RuangPENS adalah aplikasi web sederhana untuk membantu mahasiswa, terutama mahasiswa baru PENS, memahami kode ruangan dan mencari petunjuk menuju ruangan tersebut.

Aplikasi ini dibuat untuk pengguna yang belum familiar dengan kode ruangan di lingkungan PENS.

## Identitas

* **Nama:** Nabila Putri
* **NRP:** 5125500044
* **Kelas:** 2 D3 MMB B
* **Mata Kuliah:** Praktikum Pemrograman Visual (TB033109)
* **Proyek awal:** Tugas 4 – Prototipe Terpadu (pengembangan dari Tugas 3 – Event Handling)

## Tautan

* **Aplikasi (Netlify):** https://ruangpens.netlify.app
* **Repositori GitHub:** https://github.com/abilwashere/ppv-project-akhir-5125500044

## Cara Menjalankan

1. Unduh atau clone repositori RuangPENS.
2. Buka folder proyek menggunakan Visual Studio Code.
3. Jalankan `index.html` menggunakan ekstensi Live Server atau server lokal lainnya.
4. Buka alamat HTTP yang diberikan server melalui browser.

Aplikasi menggunakan ES Modules sehingga perlu dijalankan melalui server lokal.

## Fitur Aplikasi

### 1. Pencarian Ruangan

* Mencari ruangan melalui pilihan gedung, lantai, dan ruangan.
* Mencari ruangan dengan mengetik kode ruangan.
* Menampilkan informasi ruangan, petunjuk arah, dan denah.

### 2. Panduan

* Menjelaskan cara membaca kode ruangan.
* Menyediakan contoh kode yang dapat dipilih untuk langsung menjalankan pencarian.

### 3. Riwayat

* Menyimpan hingga lima pencarian terakhir.
* Menyediakan pilihan kode ruangan pada riwayat untuk melakukan pencarian kembali.

### 4. Petunjuk Arah

* Menampilkan informasi lokasi gedung dan lantai.
* Menyediakan tombol untuk menyalin teks petunjuk arah.

### 5. Animasi dan Tampilan Responsif

* Menggunakan animasi JavaScript dan CSS pada beberapa interaksi.
* Mendukung pengaturan `prefers-reduced-motion`.
* Tampilan disesuaikan untuk layar ponsel dan laptop.



## Komponen Reusable (P12)



RuangPENS menggunakan objek `UIPustaka` sebagai pembungkus pustaka UI Bootstrap 5.3.3. Fungsi `UIPustaka.tombolKode()` digunakan untuk membuat tombol kode ruangan secara dinamis.



Komponen tersebut digunakan kembali pada daftar riwayat pencarian dan daftar contoh kode pada bagian panduan. Dengan demikian, pembuatan tombol tidak perlu ditulis berulang dan tampilannya tetap konsisten.



## Penyimpanan Aman (P12)



Pengelolaan penyimpanan browser dipisahkan ke dalam modul `storage.js` dan dihubungkan ke aplikasi melalui `storage-bridge.js`.



Aplikasi menggunakan kunci penyimpanan berversi:

- `ruangpens:riwayat:v1` untuk riwayat pencarian.

- `ruangpens:suara:v1` untuk pengaturan suara.



Penanganan penyimpanan mencakup:

- Validasi format data sebelum digunakan.

- Penanganan JSON rusak dan data yang tidak sesuai format.

- Penanganan kondisi ketika `localStorage` tidak tersedia.

- Penyimpanan sementara di memori sebagai cadangan ketika penyimpanan browser bermasalah.



Pengujian dilakukan menggunakan data JSON rusak dan data dengan tipe yang tidak sesuai untuk memastikan aplikasi tetap dapat digunakan.



## Data Ruangan

Data ruangan yang digunakan merupakan data simulasi untuk kebutuhan prototipe, bukan daftar resmi seluruh ruangan kampus.

* **PS:** Gedung Pascasarjana; 11 lantai, masing-masing 5 ruangan.
* **SAW:** Gedung SAW; 11 lantai, masing-masing 5 ruangan.
* **JJ:** Gedung D3; 3 lantai, masing-masing 5 ruangan.
* **HH:** Gedung D4; 3 lantai, masing-masing 5 ruangan.

Total terdapat 140 kode ruangan simulasi.

Contoh input valid: `PS 1.03`, `SAW 2.05`, `HH 1.04`, dan `JJ 1.02`.

## Pengembangan P10 – Debugging dan Git

Pada P10 dilakukan pemeriksaan dan perbaikan terhadap dua bug pada aplikasi:

1. **Validasi data Riwayat:** Memperbaiki penanganan data `localStorage` agar aplikasi tidak mengalami error ketika data yang tersimpan bukan berupa array.
2. **Penyalinan Petunjuk:** Memperbaiki status tombol Salin Petunjuk agar pesan berhasil atau gagal sesuai dengan hasil proses penyalinan.

Proses perbaikan dilakukan menggunakan branch terpisah untuk setiap bug, kemudian digabungkan ke branch utama melalui Git merge.

Dokumentasi proses debugging dan hasil pengujian dapat dilihat pada `docs/DEBUG_LOG.md`.

## Aset Media dan Sumber

* **Logo:** Dibuat sendiri menggunakan elemen Canva.
* **Audio `success.mp3`:** Diunduh dari Pixabay.

Informasi nama file, jenis, ukuran, sumber, dan lisensi aset dicatat dalam `assets/manifest.json`.

## Catatan Pengerjaan dan Atribusi

Pengembangan navigasi pada Bagian B Tugas 4 dibantu AI (Claude). Desain, pengembangan fitur lainnya, data dan informasi yang dimasukkan, pengujian, serta penulisan penjelasan penyebab bug dikerjakan sendiri.

**Tautan percakapan atau prompt AI:** Tambahkan tautan percakapan Claude yang digunakan jika tersedia.

## Struktur File

```text
ppv-project-akhir-5125500044/
├── index.html
├── style.css
├── script.js
├── README.md
├── assets/
│   ├── logo.png
│   ├── success.mp3
│   └── manifest.json
├── docs/
│   ├── DEBUG_LOG.md
│   └── ROADMAP.md
└── screenshot/
    ├── darkmode.png
    ├── empty-state.png
    ├── hasil-pencarian-p09.png
    ├── lightmode.png
    ├── network-bootstrap.png
    ├── notifikasi-bootstrap.png
    ├── responsif-laptop.png
    ├── responsif-mobile.png
    ├── success.png
    └── wrong-input.png
    ├── CHANGELOG.md
├── ui-pustaka.js
├── storage.js
├── storage-bridge.js
```
