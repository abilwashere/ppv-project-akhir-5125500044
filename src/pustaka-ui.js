/*
 * RuangPENS — Pembungkus Pustaka UI
 * Pustaka UI: Bootstrap 5.3.3
 */

export const UIPustaka = {
  aturTema(tema) {
    if (!["light", "dark"].includes(tema)) return;
    document.documentElement.setAttribute("data-bs-theme", tema);
  },

  tampilkan(elemen, tampil = true) {
    if (!elemen) return;
    elemen.classList.toggle("d-none", !tampil);
  },

  tombolKode(kode, aksiKlik) {
    const li = document.createElement("li");
    const tombol = document.createElement("button");

    tombol.type = "button";
    tombol.className = "kode-btn";
    tombol.textContent = kode;
    tombol.addEventListener("click", aksiKlik);

    li.appendChild(tombol);
    return li;
  },

  notifikasi(pesan, jenis = "primary") {
    const jenisValid = ["primary", "success", "danger", "warning", "info"];
    const warna = jenisValid.includes(jenis) ? jenis : "primary";

    const notifikasi = document.createElement("div");
    notifikasi.className = `alert alert-${warna} alert-dismissible fade show`;
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