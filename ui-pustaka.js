
/*
 * RuangPENS — Pembungkus Pustaka UI
 * Pustaka UI yang digunakan: Bootstrap 5.3.3
 */

const UIPustaka = {
  // Mengatur tema halaman
  aturTema(tema) {
    const temaValid = ["light", "dark"];

    if (!temaValid.includes(tema)) {
      console.warn("Tema tidak tersedia:", tema);
      return;
    }

    document.documentElement.setAttribute("data-bs-theme", tema);
  },

  // Menampilkan atau menyembunyikan elemen
  tampilkan(elemen, tampil = true) {
    if (!elemen) return;

    elemen.classList.toggle("d-none", !tampil);
  },

  // Membuat notifikasi sederhana
  notifikasi(pesan, jenis = "primary") {
    const jenisValid = [
      "primary",
      "success",
      "danger",
      "warning",
      "info"
    ];

    const warna = jenisValid.includes(jenis) ? jenis : "primary";
    const notifikasi = document.createElement("div");

    notifikasi.className =
      `alert alert-${warna} alert-dismissible fade show`;
    notifikasi.setAttribute("role", "alert");
    notifikasi.textContent = pesan;

    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "btn-close";
    tombol.setAttribute("data-bs-dismiss", "alert");
    tombol.setAttribute("aria-label", "Tutup");

    notifikasi.appendChild(tombol);
    document.body.appendChild(notifikasi);

    return notifikasi;
  }
};

// Menyediakan pembungkus agar bisa digunakan oleh file lain
window.UIPustaka = UIPustaka;
