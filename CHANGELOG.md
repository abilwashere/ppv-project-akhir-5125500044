# Changelog



Semua perubahan penting pada proyek RuangPENS dicatat di file ini.



Format mengikuti Keep a Changelog dan menggunakan Semantic Versioning.



## [0.4.0] - 2026-11-11



### Added

- Menambahkan pembungkus pustaka UI `UIPustaka`.

- Menggunakan fungsi `tombolKode()` sebagai komponen reusable pada daftar riwayat dan contoh kode.

- Menambahkan modul `storage.js` untuk mengelola penyimpanan riwayat dan pengaturan suara.

- Menambahkan `storage-bridge.js` sebagai penghubung modul penyimpanan dengan aplikasi.



### Changed

- Menggunakan kunci penyimpanan berversi `ruangpens:riwayat:v1` dan `ruangpens:suara:v1`.

- Memperkuat validasi data riwayat dan pengaturan suara.

- Menambahkan penanganan JSON rusak dan data dengan format tidak sesuai.

- Menambahkan penyimpanan sementara di memori ketika localStorage tidak tersedia.



## [0.3.0] - 2026-11-06



### Changed

- Memisahkan pengelolaan penyimpanan ke dalam modul ES Modules.

- Menghubungkan modul penyimpanan dengan aplikasi melalui bridge.



## [0.2.0] - 2026-11-04



### Added

- Menambahkan pembungkus pustaka UI Bootstrap 5.3.3.

- Menambahkan fungsi bantuan untuk tema, tampilan elemen, tombol kode, dan notifikasi.



### Fixed

- Memperbaiki sejumlah bug dan penanganan interaksi aplikasi.



## [0.1.0] - 2026-10-31



### Added

- Menyimpan basis awal proyek RuangPENS dari Tugas 4.

- Menambahkan dokumentasi piagam proyek dan struktur awal aplikasi.
