# Dependencies — RuangPENS

## 1. Bootstrap

- **Nama pustaka:** Bootstrap
- **Versi:** 5.3.3
- **Jenis:** CSS framework dan JavaScript components
- **Sumber:** jsDelivr CDN
- **URL CSS:** https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
- **URL JavaScript:** https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
- **Ukuran transfer CSS:** 234 kB (berdasarkan hasil pengamatan pada Chrome DevTools Network; pastikan angka ini berasal dari kolom Size pada request `bootstrap.min.css`, bukan total seluruh request).

### Penggunaan

Bootstrap CSS dimuat sebelum `style.css` agar aturan CSS khusus RuangPENS dapat menyesuaikan tampilan komponen. Bootstrap JavaScript Bundle dimuat sebelum `ui-pustaka.js` dan `script.js`.

Komponen dan fitur Bootstrap yang digunakan:

1. **Navbar** — digunakan pada navigasi halaman RuangPENS.
2. **Form Select** — digunakan pada pilihan gedung melalui elemen dengan kelas `form-select`.
3. **Button** — digunakan pada tombol pencarian dengan kelas `btn btn-primary`.
4. **Alert** — digunakan untuk menampilkan notifikasi ketika pencarian ruangan berhasil.

### Pengaturan Tema

Tema Bootstrap diatur melalui atribut `data-bs-theme` pada elemen `<html>`. Variabel CSS Bootstrap disesuaikan untuk warna utama dan tema gelap. CSS khusus RuangPENS tetap digunakan untuk mempertahankan desain visual aplikasi.

## 2. Pembungkus Pustaka: `ui-pustaka.js`

File `ui-pustaka.js` menjadi pembungkus fungsi antarmuka yang berkaitan dengan Bootstrap agar penggunaannya terpusat.

Fungsi yang tersedia:

- `UIPustaka.aturTema(tema)` — mengatur tema menjadi `light` atau `dark`.
- `UIPustaka.tampilkan(elemen, tampil)` — menampilkan atau menyembunyikan elemen menggunakan kelas `d-none`.
- `UIPustaka.notifikasi(pesan, jenis)` — membuat notifikasi menggunakan komponen Alert Bootstrap.

Contoh penggunaan:

```javascript
UIPustaka.aturTema("dark");

UIPustaka.notifikasi("Pencarian berhasil!", "success");
```

## 3. Dependensi Lain

- `script.js` — menangani logika pencarian ruangan, validasi kode, denah, navigasi, riwayat, suara, dan petunjuk arah.
- `style.css` — mengatur tampilan khusus RuangPENS dan penyesuaian tema.
- JavaScript bawaan browser — digunakan untuk manipulasi DOM dan interaksi antarmuka.

Bootstrap dimuat melalui CDN sehingga koneksi internet diperlukan untuk mengambil berkas pustaka. File `ui-pustaka.js` dimuat setelah Bootstrap JavaScript Bundle dan sebelum `script.js`.

## 4. Evaluasi Sebelum Memasang Pustaka

**1. Apa kebutuhan antarmuka yang ingin diselesaikan?**

Bootstrap digunakan untuk membantu penerapan komponen antarmuka seperti navigasi, pilihan gedung, tombol pencarian, dan notifikasi tanpa harus membuat seluruh tampilannya dari awal.

**2. Mengapa memilih Bootstrap?**

Bootstrap dipilih karena menyediakan komponen siap pakai, dokumentasi yang jelas, mendukung tampilan responsif, dan dapat digunakan melalui CDN.

**3. Apa dampak pustaka terhadap ukuran dan performa aplikasi?**

Bootstrap menambah ukuran berkas yang perlu dimuat browser. Ukuran transfer diamati melalui Chrome DevTools Network. Penggunaan komponen yang sesuai kebutuhan membantu menghindari penambahan kode antarmuka secara berlebihan.

**4. Bagaimana memastikan pustaka sesuai dengan aplikasi?**

Kesesuaian diuji dengan menjalankan fitur pencarian ruangan, memeriksa komponen Bootstrap, menguji tema terang dan gelap, serta memeriksa tampilan pada ukuran layar berbeda. CSS khusus juga diperiksa agar tidak merusak fungsi maupun desain aplikasi.
