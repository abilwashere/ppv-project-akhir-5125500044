# Module Map RuangPENS

## 1. Entry Point

`src/main.js` merupakan entry point aplikasi yang mengatur alur utama dan menghubungkan seluruh modul.

## 2. Pembagian Modul

### data.js
Mengelola data gedung, lantai, ruangan, serta informasi petunjuk arah. Menyediakan fungsi untuk membuat data lantai dan mencari gedung berdasarkan kode.

### storage.js
Mengelola penyimpanan dan pembacaan preferensi suara serta riwayat pencarian menggunakan localStorage.

### pustaka-ui.js
Mengelola fungsi antarmuka, meliputi pengaturan tema, penampilan elemen, dan notifikasi.

### main.js
Mengatur proses utama aplikasi, event listener, pencarian ruangan, navigasi halaman, tampilan hasil, dan interaksi pengguna.

## 3. Hubungan Antar Modul

- `main.js` mengimpor data dan fungsi pencarian dari `data.js`.
- `main.js` mengimpor fungsi penyimpanan dari `storage.js`.
- `main.js` mengimpor objek `UIPustaka` dari `pustaka-ui.js`.

## 4. Alur Modul

`index.html` → `src/main.js` → `data.js`, `storage.js`, dan `pustaka-ui.js`.

## 5. Teknologi

- JavaScript ES Modules
- `import` dan `export`
- Browser localStorage