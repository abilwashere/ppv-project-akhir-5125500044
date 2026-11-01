# DEBUG LOG – RUANGPENS

## Bug 1 – Validasi Data Riwayat Pencarian

**Branch:** `fix/validasi-riwayat`  
**Commit:** `3dc15ee fix: validate riwayat localStorage data`  
**Merge commit:** `eecb2c7`

### 1. Reproduksi Bug
Bug ditemukan pada fitur Riwayat pencarian. Ketika data `riwayat` di localStorage memiliki format JSON yang valid tetapi bukan array, halaman mengalami error saat fitur Riwayat dibuka.

Contoh data yang digunakan untuk pengujian:

```js
localStorage.setItem("riwayat", "{}");
location.reload();
```

### 2. Hipotesis
- Data riwayat di localStorage mungkin memiliki format yang tidak sesuai.
- Proses parsing JSON mungkin gagal.
- Fungsi render riwayat mungkin menganggap semua data hasil parsing selalu berupa array.

### 3. Bukti DevTools
Pengujian menunjukkan error ketika fungsi `.map()` dijalankan pada data yang bukan array. Pesan error yang muncul adalah `riwayat.map is not a function` atau `Cannot read properties of null (reading 'map')`.

### 4. Penyebab Sebenarnya
Data dari localStorage langsung digunakan tanpa memeriksa apakah hasil parsing merupakan array. JSON seperti `{}` dan `null` dapat berhasil diparsing, tetapi tidak dapat diproses menggunakan `.map()`.

**Lokasi:** `script.js`, bagian pembacaan data Riwayat pencarian.

### 5. Perbaikan
Menambahkan pemeriksaan `Array.isArray()` agar data yang bukan array diubah menjadi array kosong. Penanganan error parsing juga diarahkan ke array kosong.

### 6. Pengujian Ulang
Data `{}` dan `null` diuji kembali. Setelah perbaikan, halaman dapat dibuka dan fitur Riwayat menampilkan kondisi kosong tanpa error pada Console.

**Status:** Fixed, committed, merged, dan pushed ke `master`.

---

## Bug 2 – Status Salin Petunjuk Tidak Sesuai

**Branch:** `fix/validasi-salin-petunjuk`  
**Commit:** `0052e0b fix: handle clipboard copy failure`  
**Merge commit:** `b0453f4`

### 1. Reproduksi Bug
Bug ditemukan pada tombol Salin Petunjuk. Ketika proses penyalinan gagal, tombol tetap menampilkan pesan bahwa teks berhasil disalin.

Kondisi kegagalan diuji dengan membuat Clipboard API gagal dan memaksa fallback `document.execCommand("copy")` mengembalikan nilai `false`.

### 2. Hipotesis
- Clipboard API mungkin tidak tersedia atau gagal digunakan.
- Metode fallback menggunakan `document.execCommand("copy")` mungkin juga gagal.
- Tampilan status tombol mungkin tidak memeriksa hasil proses penyalinan.

### 3. Bukti DevTools
Ketika kedua metode penyalinan dibuat gagal, tombol tetap menampilkan pesan `Tersalin!`. Hal ini menunjukkan bahwa status keberhasilan tidak sesuai dengan hasil proses penyalinan.

### 4. Penyebab Sebenarnya
Kode sebelumnya selalu mengubah teks tombol menjadi `Tersalin!` setelah proses penyalinan, tanpa memeriksa apakah Clipboard API atau metode fallback benar-benar berhasil.

**Lokasi:** `script.js`, event listener tombol `salinBtn`.

### 5. Perbaikan
Menambahkan variabel `berhasil` untuk menyimpan hasil proses penyalinan. Status tombol sekarang menampilkan `Tersalin!` jika proses berhasil dan `Gagal menyalin` jika kedua metode penyalinan gagal.

### 6. Pengujian Ulang
Pengujian dilakukan dengan membuat Clipboard API gagal dan fallback mengembalikan `false`. Setelah perbaikan, tombol menampilkan pesan `Gagal menyalin`, bukan lagi pesan keberhasilan yang keliru.

**Status:** Fixed, committed, merged, dan pushed ke `master`.
