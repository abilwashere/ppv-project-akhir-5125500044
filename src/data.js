
/* ---------- Data ruangan PENS ---------- */

export function buatLantai(jumlahLantai, jumlahRuangan) {
  return Object.fromEntries(
    Array.from({ length: jumlahLantai }, (_, i) => [
      i + 1,
      Array.from({ length: jumlahRuangan }, (_, j) => j + 1)
    ])
  );
}

export const daftarGedung = [
  {
    kode: "PS",
    nama: "Gedung Pascasarjana",
    jumlahLantai: 11,
    lantai: buatLantai(11, 5)
  },
  {
    kode: "SAW",
    nama: "Gedung SAW",
    jumlahLantai: 11,
    lantai: buatLantai(11, 5)
  },
  {
    kode: "HH",
    nama: "Gedung D4",
    jumlahLantai: 3,
    lantai: buatLantai(3, 5)
  },
  {
    kode: "JJ",
    nama: "Gedung D3",
    jumlahLantai: 3,
    lantai: buatLantai(3, 5)
  }
];

export function cariGedung(kode) {
  return daftarGedung.find(g => g.kode === kode);
}

/* ---------- Informasi petunjuk arah ---------- */

export const infoGedung = {
  PS: {
    letak: "Gedung paling depan, langsung kelihatan dari gerbang.",
    akses: (l) => l === 1
      ? "Dari lantai B, naik tangga ke lantai 1."
      : `Dari lantai 1, naik lift ke lantai ${l}.`,
    sambung: (l) => l === 2
      ? "Lantai 2 tersambung dengan lantai 2 gedung SAW."
      : ""
  },
  SAW: {
    letak: "Di belakang Gedung Pascasarjana (PS).",
    akses: (l) => l === 1
      ? "Dari lantai ground, naik tangga atau lift ke lantai 1."
      : `Naik ke lantai ${l} dari lantai 1.`,
    sambung: (l) => l === 2
      ? "Lantai 2 tersambung dengan lantai 2 Pascasarjana, jadi bisa lewat PS."
      : "Lantai 1 tidak tersambung dengan Pascasarjana."
  },
  JJ: {
    letak: "Dekat kantin.",
    akses: () => "Akses naik hanya lewat tangga.",
    sambung: () => ""
  },
  HH: {
    letak: "Membentang sendiri, di bagian paling belakang.",
    akses: () => "Akses naik hanya lewat tangga.",
    sambung: () => ""
  }
};
