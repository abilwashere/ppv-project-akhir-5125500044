/* ===========================================================
   RuangPENS — Pencari Ruangan Kampus
   Tugas 3 Praktikum Pemrograman Visual

   Event yang dipakai:
     1. DOMContentLoaded -> mengisi dropdown gedung saat halaman siap
     2. change (gedung)  -> mengisi ulang dropdown lantai
     3. change (lantai)  -> mengisi ulang dropdown ruangan
     4. click             -> pindah antara mode "pilih" dan mode "manual"
     5. input              -> respons langsung saat mengetik kode manual
     6. mouseover          -> teks tombol berubah saat kursor di atasnya
     7. keydown             -> Enter langsung memicu pencarian
     8. submit               -> menjalankan validasi lalu pencarian
   =========================================================== /

/* ---------- Data ruangan PENS ----------
   Satu sumber data untuk semuanya: dropdown gedung, dropdown lantai,
   dropdown ruangan, dan validasi kode manual sama-sama membaca dari sini.
   "lantai" adalah objek: kuncinya nomor lantai, isinya daftar nomor ruangan. */
function buatLantai(jumlahLantai, jumlahRuangan) {
  return Object.fromEntries(
    Array.from({ length: jumlahLantai }, (_, i) => [
      i + 1,
      Array.from({ length: jumlahRuangan }, (_, j) => j + 1)
    ])
  );
}

const daftarGedung = [
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

// Mencari data satu gedung lewat kodenya, dipakai berkali-kali di bawah
function cariGedung(kode) {
  return daftarGedung.find(g => g.kode === kode);
}

/* ===========================================================
   EVENT 1 — 'DOMContentLoaded'
   Menunggu HTML selesai dibaca browser sebelum JavaScript mulai
   mengambil elemen. Kalau ini dilewat, document.getElementById
   bisa mengembalikan null karena elemennya belum ada.
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Mengambil elemen dari HTML ---------- */
  const roomForm     = document.getElementById("roomForm");
  const searchButton = document.getElementById("searchButton");

  const modeBtns    = document.querySelectorAll(".mode-btn");
  const modePilih   = document.getElementById("modePilih");
  const modeManual  = document.getElementById("modeManual");
  let modeAktif     = "pilih"; // status mode saat ini, "pilih" atau "manual"

  const gedungSelect  = document.getElementById("gedungSelect");
  const lantaiSelect  = document.getElementById("lantaiSelect");
  const ruanganSelect = document.getElementById("ruanganSelect");
  const errorPilih    = document.getElementById("errorPilih");

  const roomCode      = document.getElementById("roomCode");
  const inputMessage  = document.getElementById("inputMessage");

  const loadingState = document.getElementById("loadingState");
  const emptyState   = document.getElementById("emptyState");
  const resultState  = document.getElementById("resultState");

  const buildingResult = document.getElementById("buildingResult");
  const floorResult    = document.getElementById("floorResult");
  const roomResult     = document.getElementById("roomResult");

  const petaKampus      = document.getElementById("petaKampus");
  const denahLantai     = document.getElementById("denahLantai");
  const lantaiLabelDenah= document.getElementById("lantaiLabelDenah");


  /* ---------- Mengisi dropdown gedung ----------
     Dijalankan sekali saat halaman siap. Untuk tiap gedung di
     daftarGedung, dibuat satu <option> lewat document.createElement,
     bukan ditulis manual di HTML. */
  daftarGedung.forEach(gedung => {
    const opsi = document.createElement("option");
    opsi.value = gedung.kode;
    opsi.textContent = `${gedung.nama} (${gedung.kode})`;
    gedungSelect.appendChild(opsi);
  });


  /* ---------- Mengisi denah kampus ----------
     Satu kotak per gedung, dibuat dari daftarGedung yang sama
     dipakai buat dropdown — supaya tidak ada data yang ditulis dua kali. */
  daftarGedung.forEach(gedung => {
    const kotak = document.createElement("div");
    kotak.className = "gedung-blok";
    kotak.dataset.kode = gedung.kode;
    kotak.setAttribute("aria-label", `${gedung.nama}, ${gedung.jumlahLantai} lantai`);

    const nama = document.createElement("strong");
    nama.className = "gedung-nama";
    nama.textContent = gedung.kode;

    const ilustrasi = document.createElement("span");
    ilustrasi.className = "gedung-tingkat";
    ilustrasi.setAttribute("aria-hidden", "true");
    for (let i = 0; i < gedung.jumlahLantai; i++) {
      const garis = document.createElement("span");
      garis.className = "tingkat";
      ilustrasi.appendChild(garis);
    }

    const jumlah = document.createElement("small");
    jumlah.className = "gedung-jumlah-lantai";
    jumlah.textContent = `${gedung.jumlahLantai} lantai`;

    kotak.append(nama, ilustrasi, jumlah);
    petaKampus.appendChild(kotak);
  });


  /* ===========================================================
     EVENT 2 — 'change' pada dropdown gedung
     Begitu gedung dipilih, dropdown lantai diisi ulang sesuai
     lantai yang dimiliki gedung itu. Dropdown ruangan direset
     ke kondisi awal karena pilihan lantai sebelumnya sudah
     tidak berlaku lagi.
     =========================================================== */
  gedungSelect.addEventListener("change", () => {
    const gedung = cariGedung(gedungSelect.value);

    // Kosongkan lalu isi ulang dropdown lantai
    lantaiSelect.innerHTML = '<option value="" disabled selected>Pilih lantai</option>';
    Object.keys(gedung.lantai).forEach(nomorLantai => {
      const opsi = document.createElement("option");
      opsi.value = nomorLantai;
      opsi.textContent = `Lantai ${nomorLantai}`;
      lantaiSelect.appendChild(opsi);
    });
    lantaiSelect.disabled = false;

    // Reset dropdown ruangan, karena lantai barusan berubah
    ruanganSelect.innerHTML = '<option value="" disabled selected>Pilih lantai dulu</option>';
    ruanganSelect.disabled = true;

    bersihkanErrorPilih();
  });


  /* ===========================================================
     EVENT 3 — 'change' pada dropdown lantai
     Sama seperti di atas, tapi satu tingkat lebih dalam: mengisi
     dropdown ruangan sesuai ruangan yang ada di lantai tersebut.
     =========================================================== */
  lantaiSelect.addEventListener("change", () => {
    const gedung = cariGedung(gedungSelect.value);
    const daftarRuangan = gedung.lantai[lantaiSelect.value];

    ruanganSelect.innerHTML = "";
    daftarRuangan.forEach(nomorRuangan => {
      const opsi = document.createElement("option");
      opsi.value = nomorRuangan;
      opsi.textContent = `Ruang ${String(nomorRuangan).padStart(2, "0")}`;
      ruanganSelect.appendChild(opsi);
    });
    ruanganSelect.disabled = false;

    bersihkanErrorPilih();
  });


  /* ===========================================================
     EVENT 4 — 'click' pada tombol mode
     Memindahkan tampilan antara mode dropdown dan mode ketik
     manual. Dipasang di kedua tombol lewat forEach, jadi satu
     fungsi yang sama melayani keduanya — tinggal dibaca dari
     atribut data-mode tombol mana yang diklik.
     =========================================================== */
  modeBtns.forEach(tombol => {
    tombol.addEventListener("click", () => {
      modeAktif = tombol.dataset.mode; // "pilih" atau "manual"

      modeBtns.forEach(t => {
        t.classList.toggle("aktif", t === tombol);
        t.setAttribute("aria-selected", t === tombol ? "true" : "false");
      });

      modePilih.classList.toggle("hidden", modeAktif !== "pilih");
      modeManual.classList.toggle("hidden", modeAktif !== "manual");

      bersihkanErrorPilih();
      inputMessage.textContent = "";
    });
  });


  /* ===========================================================
     EVENT 5 — 'input' pada kolom kode manual
     Memberi respons langsung sambil mengetik, sebelum pencarian
     benar-benar dijalankan.
     =========================================================== */
  roomCode.addEventListener("input", () => {
    const value = roomCode.value.trim();

    if (value === "") {
      inputMessage.textContent = "";
      inputMessage.className = "error";
      return;
    }

    inputMessage.textContent = "Tekan Enter atau klik Cari Ruangan untuk mencari.";
    inputMessage.className = "";
  });


  /* ===========================================================
     EVENT 6 — 'mouseover' pada tombol cari
     Sentuhan kecil: teks tombol berubah saat kursor diarahkan
     ke atasnya.
     =========================================================== */
  searchButton.addEventListener("mouseover", () => {
    if (!searchButton.disabled) searchButton.textContent = "🔎 Cari sekarang";
  });
  searchButton.addEventListener("mouseout", () => {
    if (!searchButton.disabled) searchButton.textContent = "Cari Ruangan";
  });


  /* ===========================================================
     EVENT 7 — 'keydown'  (tantangan tambahan)
     Enter di kolom kode manual langsung memicu pencarian, tanpa
     harus mengklik tombol.
     =========================================================== */
  roomCode.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      roomForm.requestSubmit();
    }
  });


  /* ===========================================================
     EVENT 8 — 'submit'
     Titik pusat semuanya: menahan reload, memvalidasi sesuai
     mode yang aktif, lalu menjalankan pencarian kalau valid.
     =========================================================== */
  roomForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const hasil = modeAktif === "manual" ? validasiManual() : validasiPilih();

    if (!hasil.valid) {
      tampilkanKosongDenganError();
      return;
    }

    jalankanPencarian(hasil.kodeGedung, hasil.lantai, hasil.ruangan);
  });


  /* ===========================================================
     VALIDASI — mode pilih dari dropdown
     Karena dropdown lantai & ruangan hanya berisi pilihan yang
     memang ada di gedung tersebut, di sini cukup dicek apakah
     ketiganya sudah dipilih. Kombinasi yang salah (misalnya
     lantai yang tidak ada) tidak mungkin terjadi lewat dropdown.
     =========================================================== */
  function validasiPilih() {
    bersihkanErrorPilih();

    // Aturan 1 — gedung wajib dipilih
    if (gedungSelect.value === "") {
      tampilkanErrorPilih("Pilih gedungnya dulu ya.");
      return { valid: false };
    }
    // Aturan 2 — lantai wajib dipilih
    if (lantaiSelect.value === "") {
      tampilkanErrorPilih("Lantainya belum dipilih.");
      return { valid: false };
    }
    // Aturan 3 — ruangan wajib dipilih
    if (ruanganSelect.value === "") {
      tampilkanErrorPilih("Ruangannya belum dipilih.");
      return { valid: false };
    }

    return {
      valid: true,
      kodeGedung: gedungSelect.value,
      lantai: Number(lantaiSelect.value),
      ruangan: Number(ruanganSelect.value)
    };
  }

  function tampilkanErrorPilih(pesan) {
    errorPilih.textContent = "⚠️ " + pesan;
  }
  function bersihkanErrorPilih() {
    errorPilih.textContent = "";
  }


  /* ===========================================================
     VALIDASI — mode ketik kode manual
     Lima aturan, semuanya harus lolos berurutan sebelum kode
     dianggap sah.
     =========================================================== */
  function validasiManual() {
    const kode = roomCode.value.trim().toUpperCase();

    // Aturan 1 — tidak boleh kosong
    if (kode === "") {
      tampilkanErrorManual("Kode ruangan belum diisi.");
      return { valid: false };
    }

    // Aturan 2 — formatnya harus sesuai pola "KODE angka.angka"
    // contoh yang benar: PS 1.03, SAW 2.07
    const polaKode = /^(PS|SAW|HH|JJ)\s\d+\.\d{2}$/;
    if (!polaKode.test(kode)) {
      tampilkanErrorManual("Format salah. Contoh yang benar: PS 1.03");
      return { valid: false };
    }

    const bagian = kode.split(" ");
    const kodeGedung = bagian[0];
    const bagianRuang = bagian[1].split(".");
    const lantai = Number(bagianRuang[0]);
    const ruangan = Number(bagianRuang[1]);

    // Aturan 3 — kode gedung harus dikenal
    const gedung = cariGedung(kodeGedung);
    if (!gedung) {
      tampilkanErrorManual("Kode gedung tidak ditemukan.");
      return { valid: false };
    }

    // Aturan 4 — lantai harus ada di gedung itu
    if (!gedung.lantai[lantai]) {
      tampilkanErrorManual(`${kodeGedung} tidak punya lantai ${lantai}.`);
      return { valid: false };
    }

    // Aturan 5 — nomor ruangan harus ada di lantai itu
    if (!gedung.lantai[lantai].includes(ruangan)) {
      tampilkanErrorManual(`Ruang ${String(ruangan).padStart(2, "0")} tidak ada di lantai ${lantai}.`);
      return { valid: false };
    }

    return { valid: true, kodeGedung, lantai, ruangan };
  }

  function tampilkanErrorManual(pesan) {
    inputMessage.textContent = "⚠️ " + pesan;
    inputMessage.className = "error";
  }


  /* ---------- Mengatur tiga kondisi tampilan ---------- */
  function tampilkanKosongDenganError() {
    getar(document.querySelector(".search-box"));
    resultState.classList.add("hidden");
    loadingState.classList.add("hidden");
    emptyState.classList.remove("hidden");
  }

  function jalankanPencarian(kodeGedung, lantai, ruangan) {
    emptyState.classList.add("hidden");
    resultState.classList.add("hidden");
    loadingState.classList.remove("hidden");

    searchButton.disabled = true;
    searchButton.textContent = "Mencari...";

    // Simulasi proses pencarian, supaya keadaan memuat sempat terlihat
    setTimeout(() => {
      const gedung = cariGedung(kodeGedung);

      buildingResult.textContent = gedung.nama;
      floorResult.textContent = lantai;
      roomResult.textContent = String(ruangan).padStart(2, "0");

      sorotDenah(kodeGedung, lantai, ruangan);

      loadingState.classList.add("hidden");
      emptyState.classList.add("hidden");
      resultState.classList.remove("hidden");

      searchButton.disabled = false;
      searchButton.textContent = "Cari Ruangan";
            catatRiwayat(`${kodeGedung} ${lantai}.${String(ruangan).padStart(2, "0")}`);
      mainkanBunyi();
      tampilPetunjuk(kodeGedung, lantai, ruangan);

      // Notifikasi Bootstrap saat pencarian berhasil
      if (window.UIPustaka) {
        UIPustaka.notifikasi(
          `Ruangan ${kodeGedung} ${lantai}.${String(ruangan).padStart(2, "0")} berhasil ditemukan!`,
          "success"
        );
      }
      resultState.animate(
        [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
        { duration: durasi(260), easing: "ease-out" });
    }, 800);
  }

  /* ---------- Menyorot denah sesuai hasil pencarian ---------- */
  function sorotDenah(kodeGedung, lantai, ruangan) {
    // Kotak gedung: hanya satu yang boleh menyala, sisanya diredupkan lagi
    document.querySelectorAll(".gedung-blok").forEach(kotak => {
      kotak.classList.toggle("disorot", kotak.dataset.kode === kodeGedung);
    });

    // Kotak ruangan: dibuat ulang setiap pencarian, sejumlah ruangan di lantai itu
    lantaiLabelDenah.textContent = lantai;
    denahLantai.innerHTML = "";

    const gedung = cariGedung(kodeGedung);
    gedung.lantai[lantai].forEach(nomorRuangan => {
      const kotak = document.createElement("div");
      kotak.className = "ruang-kotak";
      if (nomorRuangan === ruangan) kotak.classList.add("disorot");
      kotak.textContent = String(nomorRuangan).padStart(2, "0");
      denahLantai.appendChild(kotak);
    });
  }


  /* ===========================================================
     BAGIAN B — navigasi 3 tampilan, animasi, media
     =========================================================== */
  // Hormati pengaturan "kurangi gerakan": durasi 0 = tanpa gerak
  const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)");
  const durasi = (ms) => (kurangiGerak.matches ? 0 : ms);

  // Animasi umpan balik aksi: kotak bergetar saat input salah
  function getar(el) {
    el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" },
       { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
      { duration: durasi(280), easing: "ease-in-out" });
  }

  // Animasi transisi state: pindah tampilan memudar sambil naik
  const daftarTampilan = ["cari", "panduan", "riwayat"];
  const navBtns = document.querySelectorAll(".nav-btn");
  let tampilanAktif = "cari";

  function pindahTampilan(nama) {
    if (nama === tampilanAktif) return;
    tampilanAktif = nama;
    navBtns.forEach(b => {
      if (b.dataset.view === nama) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    daftarTampilan.forEach(v => {
      const el = document.getElementById("view-" + v);
      el.classList.toggle("hidden", v !== nama);
      if (v === nama) {
        el.animate(
          [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
          { duration: durasi(220), easing: "ease-out" });
      }
    });
    if (nama === "riwayat") tampilRiwayat();
  }
  navBtns.forEach(b => b.addEventListener("click", () => pindahTampilan(b.dataset.view)));
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) pindahTampilan(g.dataset.goto);
  });

  // Media audio: bunyi saat ruangan ketemu, bisa dimatikan
     const bunyi = new Audio("assets/success.mp3");
  const suaraBtn = document.getElementById("suaraBtn");
  let suaraAktif = true;
  try { suaraAktif = localStorage.getItem("suara") !== "mati"; } catch (_) {}
  function labelSuara() {
    suaraBtn.textContent = suaraAktif ? "🔊 Suara" : "🔇 Suara";
    suaraBtn.setAttribute("aria-pressed", String(suaraAktif));
  }
  labelSuara();
  suaraBtn.addEventListener("click", () => {
    suaraAktif = !suaraAktif;
    labelSuara();
    try { localStorage.setItem("suara", suaraAktif ? "hidup" : "mati"); } catch (_) {}
  });
  function mainkanBunyi() {
    if (!suaraAktif) return;
    bunyi.currentTime = 0;
    bunyi.play().catch((err) => console.log("Audio gagal diputar:", err));
  }

  // Riwayat pencarian (5 terakhir) dan tombol kode contoh
  let riwayat = [];
  try { riwayat = JSON.parse(localStorage.getItem("riwayat") || "[]"); } catch (_) {}
  function catatRiwayat(kode) {
    riwayat = [kode, ...riwayat.filter(k => k !== kode)].slice(0, 5);
    try { localStorage.setItem("riwayat", JSON.stringify(riwayat)); } catch (_) {}
  }
  function tombolKode(kode) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "kode-btn";
    b.textContent = kode;
    b.addEventListener("click", () => cariDariKode(kode));
    li.appendChild(b);
    return li;
  }
  function tampilRiwayat() {
    document.getElementById("riwayatList").replaceChildren(...riwayat.map(tombolKode));
    document.getElementById("riwayatKosong").classList.toggle("hidden", riwayat.length > 0);
  }
  function cariDariKode(kode) {
    pindahTampilan("cari");
    document.querySelector('.mode-btn[data-mode="manual"]').click();
    roomCode.value = kode;
    roomForm.requestSubmit();
  }
  document.getElementById("contohList").replaceChildren(
    ...["PS 1.01", "SAW 2.02", "HH 3.03", "JJ 2.04"].map(tombolKode));


  /* ===========================================================
     PETUNJUK ARAH — isi dari kondisi nyata kampus
     =========================================================== */
  const infoGedung = {
    PS: {
      letak: "Gedung paling depan, langsung kelihatan dari gerbang.",
      akses: (l) => l === 1 ? "Dari lantai B, naik tangga ke lantai 1." : `Dari lantai 1, naik lift ke lantai ${l}.`,
      sambung: (l) => l === 2 ? "Lantai 2 tersambung dengan lantai 2 gedung SAW." : ""
    },
    SAW: {
      letak: "Di belakang Gedung Pascasarjana (PS).",
      akses: (l) => l === 1 ? "Dari lantai ground, naik tangga atau lift ke lantai 1." : `Naik ke lantai ${l} dari lantai 1.`,
      sambung: (l) => l === 2 ? "Lantai 2 tersambung dengan lantai 2 Pascasarjana, jadi bisa lewat PS." : "Lantai 1 tidak tersambung dengan Pascasarjana."
    },
    JJ: { letak: "Dekat kantin.", akses: () => "Akses naik hanya lewat tangga.", sambung: () => "" },
    HH: { letak: "Membentang sendiri, di bagian paling belakang.", akses: () => "Akses naik hanya lewat tangga.", sambung: () => "" }
  };

  function susunPetunjuk(kodeGedung, lantai, ruangan) {
    const g = cariGedung(kodeGedung);
    const info = infoGedung[kodeGedung];
    const nomor = String(ruangan).padStart(2, "0");
    const baris = [
      `📍 ${g.nama} (${g.kode}): ${info.letak}`,
      `🪜 Lantai ${lantai}: ${info.akses(lantai)}`
    ];
    const s = info.sambung(lantai);
    if (s) baris.push(`🔗 ${s}`);
    baris.push(`🚪 Ruang ${nomor} (kode ${kodeGedung} ${lantai}.${nomor})`);
    return baris;
  }

  // Kotak petunjuk dibuat lewat JS dan disisipkan setelah kartu hasil
  const petunjukBox = document.createElement("div");
  petunjukBox.className = "petunjuk";
  petunjukBox.innerHTML = '<h3>🧭 Panduan menuju gedung</h3><ul id="petunjukList"></ul><button type="button" id="salinBtn" class="salin-btn">📋 Salin petunjuk</button>';
  document.querySelector(".result-card").after(petunjukBox);
  let teksPetunjuk = "";

  function tampilPetunjuk(kodeGedung, lantai, ruangan) {
    const baris = susunPetunjuk(kodeGedung, lantai, ruangan);
    teksPetunjuk = baris.join("\n");
    document.getElementById("petunjukList").replaceChildren(...baris.map(t => {
      const li = document.createElement("li");
      li.textContent = t;
      return li;
    }));
  }

  // Umpan balik aksi: tombol salin berubah dan "membal" sebentar
  document.getElementById("salinBtn").addEventListener("click", async (e) => {
    const tombol = e.currentTarget;
    try {
      await navigator.clipboard.writeText(teksPetunjuk);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = teksPetunjuk;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    tombol.textContent = "✅ Tersalin!";
    tombol.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
      { duration: durasi(300), easing: "ease-out" });
    setTimeout(() => { tombol.textContent = "📋 Salin petunjuk"; }, 1800);
  });
});