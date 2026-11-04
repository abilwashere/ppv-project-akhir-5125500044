/* ---------- Penyimpanan preferensi suara ---------- */

export function ambilStatusSuara() {
  try {
    return localStorage.getItem("suara") !== "mati";
  } catch (_) {
    return true;
  }
}

export function simpanStatusSuara(aktif) {
  try {
    localStorage.setItem("suara", aktif ? "hidup" : "mati");
  } catch (_) {}
}

/* ---------- Penyimpanan riwayat pencarian ---------- */

export function ambilRiwayat() {
  try {
    return JSON.parse(localStorage.getItem("riwayat") || "[]");
  } catch (_) {
    return [];
  }
}

export function simpanRiwayat(riwayat) {
  try {
    localStorage.setItem("riwayat", JSON.stringify(riwayat));
  } catch (_) {}
}