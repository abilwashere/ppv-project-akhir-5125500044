const KUNCI_RIWAYAT = "ruangpens:riwayat:v1";
const KUNCI_SUARA = "ruangpens:suara:v1";

let cadanganRiwayat = [];
let cadanganSuara = true;

export function ambilStatusSuara() {
  try {
    const data = localStorage.getItem(KUNCI_SUARA);

    if (data === null) return cadanganSuara;

    if (data === "hidup" || data === "mati") {
      cadanganSuara = data === "hidup";
      return cadanganSuara;
    }

    return cadanganSuara;
  } catch (error) {
    return cadanganSuara;
  }
}

export function simpanStatusSuara(aktif) {
  cadanganSuara = Boolean(aktif);

  try {
    localStorage.setItem(
      KUNCI_SUARA,
      cadanganSuara ? "hidup" : "mati"
    );
    return true;
  } catch (error) {
    return false;
  }
}

export function ambilRiwayat() {
  try {
    const data = localStorage.getItem(KUNCI_RIWAYAT);

    if (data === null) return [...cadanganRiwayat];

    const hasil = JSON.parse(data);

    if (!Array.isArray(hasil)) return [...cadanganRiwayat];

    cadanganRiwayat = hasil
      .filter(kode => typeof kode === "string" && kode.trim() !== "")
      .slice(0, 5);

    return [...cadanganRiwayat];
  } catch (error) {
    return [...cadanganRiwayat];
  }
}

export function simpanRiwayat(riwayat) {
  cadanganRiwayat = Array.isArray(riwayat)
    ? riwayat
        .filter(kode => typeof kode === "string" && kode.trim() !== "")
        .slice(0, 5)
    : [];

  try {
    localStorage.setItem(
      KUNCI_RIWAYAT,
      JSON.stringify(cadanganRiwayat)
    );
    return true;
  } catch (error) {
    return false;
  }
}