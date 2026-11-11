
const KUNCI_RIWAYAT = "ruangpens:riwayat:v1";
const KUNCI_SUARA = "ruangpens:suara:v1";

let cadanganRiwayat = [];
let cadanganSuara = true;
let pesanPenyimpanan = "";

function ambilItem(kunci, kunciLama) {
  try {
    let data = localStorage.getItem(kunci);

    // Membaca data lama jika kunci baru belum tersedia.
    if (data === null && kunciLama) {
      data = localStorage.getItem(kunciLama);
    }

    return data;
  } catch (error) {
    pesanPenyimpanan =
      "Penyimpanan browser tidak tersedia. Data sementara digunakan.";
    return null;
  }
}

export function muatRiwayat() {
  try {
    const data = ambilItem(KUNCI_RIWAYAT, "riwayat");

    if (data === null) return [...cadanganRiwayat];

    const hasil = JSON.parse(data);

    if (!Array.isArray(hasil)) {
      pesanPenyimpanan = "Data riwayat tidak valid. Menggunakan data sementara.";
      return [...cadanganRiwayat];
    }

    cadanganRiwayat = hasil
      .filter(kode => typeof kode === "string" && kode.trim() !== "")
      .slice(0, 5);

    pesanPenyimpanan = "";
    return [...cadanganRiwayat];
  } catch (error) {
    pesanPenyimpanan = "Data riwayat rusak. Menggunakan data sementara.";
    return [...cadanganRiwayat];
  }
}

export function simpanRiwayat(data) {
  const aman = Array.isArray(data)
    ? data
        .filter(kode => typeof kode === "string" && kode.trim() !== "")
        .slice(0, 5)
    : [];

  cadanganRiwayat = aman;

  try {
    localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(aman));
    pesanPenyimpanan = "";
    return true;
  } catch (error) {
    pesanPenyimpanan =
      "Riwayat hanya disimpan sementara selama halaman terbuka.";
    return false;
  }
}

export function muatSuara() {
  try {
    const data = ambilItem(KUNCI_SUARA, "suara");

    if (data === null) return cadanganSuara;

    if (data === "hidup" || data === "mati") {
      cadanganSuara = data === "hidup";
      pesanPenyimpanan = "";
      return cadanganSuara;
    }

    pesanPenyimpanan = "Pengaturan suara tidak valid. Menggunakan pengaturan default.";
    return cadanganSuara;
  } catch (error) {
    pesanPenyimpanan = "Pengaturan suara gagal dimuat.";
    return cadanganSuara;
  }
}

export function simpanSuara(aktif) {
  cadanganSuara = Boolean(aktif);

  try {
    localStorage.setItem(
      KUNCI_SUARA,
      cadanganSuara ? "hidup" : "mati"
    );
    pesanPenyimpanan = "";
    return true;
  } catch (error) {
    pesanPenyimpanan =
      "Pengaturan suara hanya berlaku selama halaman terbuka.";
    return false;
  }
}

export function ambilPesanPenyimpanan() {
  return pesanPenyimpanan;
}
