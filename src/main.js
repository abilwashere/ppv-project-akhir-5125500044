import { daftarGedung, cariGedung, infoGedung } from "./data.js";
import { UIPustaka } from "./pustaka-ui.js";
import {
  ambilStatusSuara,
  simpanStatusSuara,
  ambilRiwayat,
  simpanRiwayat
} from "./storage.js";

/* ===========================================================
   RuangPENS — Pencari Ruangan Kampus
   Entry point aplikasi
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Mengambil elemen dari HTML ---------- */
  const roomForm = document.getElementById("roomForm");
  const searchButton = document.getElementById("searchButton");

  const modeBtns = document.querySelectorAll(".mode-btn");
  const modePilih = document.getElementById("modePilih");
  const modeManual = document.getElementById("modeManual");
  let modeAktif = "pilih";

  const gedungSelect = document.getElementById("gedungSelect");
  const lantaiSelect = document.getElementById("lantaiSelect");
  const ruanganSelect = document.getElementById("ruanganSelect");
  const errorPilih = document.getElementById("errorPilih");

  const roomCode = document.getElementById("roomCode");
  const inputMessage = document.getElementById("inputMessage");

  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");
  const resultState = document.getElementById("resultState");

  const buildingResult = document.getElementById("buildingResult");
  const floorResult = document.getElementById("floorResult");
  const roomResult = document.getElementById("roomResult");

  const petaKampus = document.getElementById("petaKampus");
  const denahLantai = document.getElementById("denahLantai");
  const lantaiLabelDenah = document.getElementById("lantaiLabelDenah");


  /* ---------- Mengisi dropdown gedung ---------- */
  daftarGedung.forEach(gedung => {
    const opsi = document.createElement("option");
    opsi.value = gedung.kode;
    opsi.textContent = `${gedung.nama} (${gedung.kode})`;
    gedungSelect.appendChild(opsi);
  });


  /* ---------- Mengisi denah kampus ---------- */
  daftarGedung.forEach(gedung => {
    const kotak = document.createElement("div");
    kotak.className = "gedung-blok";
    kotak.dataset.kode = gedung.kode;
    kotak.setAttribute(
      "aria-label",
      `${gedung.nama}, ${gedung.jumlahLantai} lantai`
    );

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


  /* ---------- Event dropdown gedung ---------- */
  gedungSelect.addEventListener("change", () => {
    const gedung = cariGedung(gedungSelect.value);

    lantaiSelect.innerHTML =
      '<option value="" disabled selected>Pilih lantai</option>';

    Object.keys(gedung.lantai).forEach(nomorLantai => {
      const opsi = document.createElement("option");
      opsi.value = nomorLantai;
      opsi.textContent = `Lantai ${nomorLantai}`;
      lantaiSelect.appendChild(opsi);
    });

    lantaiSelect.disabled = false;

    ruanganSelect.innerHTML =
      '<option value="" disabled selected>Pilih lantai dulu</option>';
    ruanganSelect.disabled = true;

    bersihkanErrorPilih();
  });


  /* ---------- Event dropdown lantai ---------- */
  lantaiSelect.addEventListener("change", () => {
    const gedung = cariGedung(gedungSelect.value);
    const daftarRuangan = gedung.lantai[lantaiSelect.value];

    ruanganSelect.innerHTML = "";

    daftarRuangan.forEach(nomorRuangan => {
      const opsi = document.createElement("option");
      opsi.value = nomorRuangan;
      opsi.textContent =
        `Ruang ${String(nomorRuangan).padStart(2, "0")}`;
      ruanganSelect.appendChild(opsi);
    });

    ruanganSelect.disabled = false;
    bersihkanErrorPilih();
  });


  /* ---------- Event tombol mode ---------- */
  modeBtns.forEach(tombol => {
    tombol.addEventListener("click", () => {
      modeAktif = tombol.dataset.mode;

      modeBtns.forEach(t => {
        t.classList.toggle("aktif", t === tombol);
        t.setAttribute(
          "aria-selected",
          t === tombol ? "true" : "false"
        );
      });

      modePilih.classList.toggle("hidden", modeAktif !== "pilih");
      modeManual.classList.toggle("hidden", modeAktif !== "manual");

      bersihkanErrorPilih();
      inputMessage.textContent = "";
    });
  });


  /* ---------- Event input kode manual ---------- */
  roomCode.addEventListener("input", () => {
    const value = roomCode.value.trim();

    if (value === "") {
      inputMessage.textContent = "";
      inputMessage.className = "error";
      return;
    }

    inputMessage.textContent =
      "Tekan Enter atau klik Cari Ruangan untuk mencari.";
    inputMessage.className = "";
  });


  /* ---------- Event mouseover dan mouseout ---------- */
  searchButton.addEventListener("mouseover", () => {
    if (!searchButton.disabled) {
      searchButton.textContent = "🔎 Cari sekarang";
    }
  });

  searchButton.addEventListener("mouseout", () => {
    if (!searchButton.disabled) {
      searchButton.textContent = "Cari Ruangan";
    }
  });


  /* ---------- Event Enter pada kode manual ---------- */
  roomCode.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      roomForm.requestSubmit();
    }
  });


  /* ---------- Event submit pencarian ---------- */
  roomForm.addEventListener("submit", e => {
    e.preventDefault();

    const hasil = modeAktif === "manual"
      ? validasiManual()
      : validasiPilih();

    if (!hasil.valid) {
      tampilkanKosongDenganError();
      return;
    }

    jalankanPencarian(
      hasil.kodeGedung,
      hasil.lantai,
      hasil.ruangan
    );
  });


  /* ---------- Validasi mode dropdown ---------- */
  function validasiPilih() {
    bersihkanErrorPilih();

    if (gedungSelect.value === "") {
      tampilkanErrorPilih("Pilih gedungnya dulu ya.");
      return { valid: false };
    }

    if (lantaiSelect.value === "") {
      tampilkanErrorPilih("Lantainya belum dipilih.");
      return { valid: false };
    }

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


  /* ---------- Validasi kode manual ---------- */
  function validasiManual() {
    const kode = roomCode.value.trim().toUpperCase();

    if (kode === "") {
      tampilkanErrorManual("Kode ruangan belum diisi.");
      return { valid: false };
    }

    const polaKode = /^(PS|SAW|HH|JJ)\s\d+\.\d{2}$/;

    if (!polaKode.test(kode)) {
      tampilkanErrorManual(
        "Format salah. Contoh yang benar: PS 1.03"
      );
      return { valid: false };
    }

    const bagian = kode.split(" ");
    const kodeGedung = bagian[0];
    const bagianRuang = bagian[1].split(".");
    const lantai = Number(bagianRuang[0]);
    const ruangan = Number(bagianRuang[1]);

    const gedung = cariGedung(kodeGedung);

    if (!gedung) {
      tampilkanErrorManual("Kode gedung tidak ditemukan.");
      return { valid: false };
    }

    if (!gedung.lantai[lantai]) {
      tampilkanErrorManual(
        `${kodeGedung} tidak punya lantai ${lantai}.`
      );
      return { valid: false };
    }

    if (!gedung.lantai[lantai].includes(ruangan)) {
      tampilkanErrorManual(
        `Ruang ${String(ruangan).padStart(2, "0")} tidak ada di lantai ${lantai}.`
      );
      return { valid: false };
    }

    return { valid: true, kodeGedung, lantai, ruangan };
  }

  function tampilkanErrorManual(pesan) {
    inputMessage.textContent = "⚠️ " + pesan;
    inputMessage.className = "error";
  }


  /* ---------- Mengatur kondisi tampilan ---------- */
  function tampilkanKosongDenganError() {
    getar(document.querySelector(".search-box"));
    resultState.classList.add("hidden");
    loadingState.classList.add("hidden");
    emptyState.classList.remove("hidden");
  }


  /* ---------- Menjalankan pencarian ---------- */
  function jalankanPencarian(kodeGedung, lantai, ruangan) {
    emptyState.classList.add("hidden");
    resultState.classList.add("hidden");
    loadingState.classList.remove("hidden");

    searchButton.disabled = true;
    searchButton.textContent = "Mencari...";

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

      catatRiwayat(
        `${kodeGedung} ${lantai}.${String(ruangan).padStart(2, "0")}`
      );

      mainkanBunyi();
      tampilPetunjuk(kodeGedung, lantai, ruangan);

      UIPustaka.notifikasi(
        `Ruangan ${kodeGedung} ${lantai}.${String(ruangan).padStart(2, "0")} berhasil ditemukan!`,
        "success"
      );

      resultState.animate(
        [
          { opacity: 0, transform: "scale(0.96)" },
          { opacity: 1, transform: "none" }
        ],
        { duration: durasi(260), easing: "ease-out" }
      );
    }, 800);
  }


  /* ---------- Menyorot denah ---------- */
  function sorotDenah(kodeGedung, lantai, ruangan) {
    document.querySelectorAll(".gedung-blok").forEach(kotak => {
      kotak.classList.toggle(
        "disorot",
        kotak.dataset.kode === kodeGedung
      );
    });

    lantaiLabelDenah.textContent = lantai;
    denahLantai.innerHTML = "";

    const gedung = cariGedung(kodeGedung);

    gedung.lantai[lantai].forEach(nomorRuangan => {
      const kotak = document.createElement("div");
      kotak.className = "ruang-kotak";

      if (nomorRuangan === ruangan) {
        kotak.classList.add("disorot");
      }

      kotak.textContent = String(nomorRuangan).padStart(2, "0");
      denahLantai.appendChild(kotak);
    });
  }


  /* ---------- Pengaturan animasi ---------- */
  const kurangiGerak = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const durasi = ms => kurangiGerak.matches ? 0 : ms;

  function getar(el) {
    el.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(0)" }
      ],
      { duration: durasi(280), easing: "ease-in-out" }
    );
  }


  /* ---------- Navigasi tiga tampilan ---------- */
  const daftarTampilan = ["cari", "panduan", "riwayat"];
  const navBtns = document.querySelectorAll(".nav-btn");
  let tampilanAktif = "cari";

  function pindahTampilan(nama) {
    if (nama === tampilanAktif) return;

    tampilanAktif = nama;

    navBtns.forEach(b => {
      if (b.dataset.view === nama) {
        b.setAttribute("aria-current", "page");
      } else {
        b.removeAttribute("aria-current");
      }
    });

    daftarTampilan.forEach(v => {
      const el = document.getElementById("view-" + v);
      el.classList.toggle("hidden", v !== nama);

      if (v === nama) {
        el.animate(
          [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "none" }
          ],
          { duration: durasi(220), easing: "ease-out" }
        );
      }
    });

    if (nama === "riwayat") tampilRiwayat();
  }

  navBtns.forEach(b => {
    b.addEventListener("click", () => {
      pindahTampilan(b.dataset.view);
    });
  });

  document.addEventListener("click", e => {
    const g = e.target.closest("[data-goto]");
    if (g) pindahTampilan(g.dataset.goto);
  });


  /* ---------- Pengaturan suara ---------- */
  const bunyi = new Audio("assets/success.mp3");
  const suaraBtn = document.getElementById("suaraBtn");

  let suaraAktif = ambilStatusSuara();

  function labelSuara() {
    suaraBtn.textContent = suaraAktif ? "🔊 Suara" : "🔇 Suara";
    suaraBtn.setAttribute("aria-pressed", String(suaraAktif));
  }

  labelSuara();

  suaraBtn.addEventListener("click", () => {
    suaraAktif = !suaraAktif;
    labelSuara();
    simpanStatusSuara(suaraAktif);
  });

  function mainkanBunyi() {
    if (!suaraAktif) return;

    bunyi.currentTime = 0;
    bunyi.play().catch(err => {
      console.log("Audio gagal diputar:", err);
    });
  }


  /* ---------- Riwayat pencarian ---------- */
  let riwayat = ambilRiwayat();

  function catatRiwayat(kode) {
    riwayat = [
      kode,
      ...riwayat.filter(k => k !== kode)
    ].slice(0, 5);

    simpanRiwayat(riwayat);
  }

  function tombolKode(kode) {
  return UIPustaka.tombolKode(kode, () => cariDariKode(kode));
}

  function tampilRiwayat() {
    document.getElementById("riwayatList").replaceChildren(
      ...riwayat.map(tombolKode)
    );

    document.getElementById("riwayatKosong").classList.toggle(
      "hidden",
      riwayat.length > 0
    );
  }

  function cariDariKode(kode) {
    pindahTampilan("cari");
    document.querySelector(
      '.mode-btn[data-mode="manual"]'
    ).click();

    roomCode.value = kode;
    roomForm.requestSubmit();
  }

  document.getElementById("contohList").replaceChildren(
    ...["PS 1.01", "SAW 2.02", "HH 3.03", "JJ 2.04"].map(tombolKode)
  );


  /* ---------- Petunjuk arah ---------- */
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

    baris.push(
      `🚪 Ruang ${nomor} (kode ${kodeGedung} ${lantai}.${nomor})`
    );

    return baris;
  }

  const petunjukBox = document.createElement("div");
  petunjukBox.className = "petunjuk";
  petunjukBox.innerHTML =
    '<h3>🧭 Panduan menuju gedung</h3><ul id="petunjukList"></ul><button type="button" id="salinBtn" class="salin-btn">📋 Salin petunjuk</button>';

  document.querySelector(".result-card").after(petunjukBox);

  let teksPetunjuk = "";

  function tampilPetunjuk(kodeGedung, lantai, ruangan) {
    const baris = susunPetunjuk(kodeGedung, lantai, ruangan);
    teksPetunjuk = baris.join("\n");

    document.getElementById("petunjukList").replaceChildren(
      ...baris.map(t => {
        const li = document.createElement("li");
        li.textContent = t;
        return li;
      })
    );
  }


  /* ---------- Tombol salin petunjuk ---------- */
  document.getElementById("salinBtn").addEventListener(
    "click",
    async e => {
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
        [
          { transform: "scale(1)" },
          { transform: "scale(1.12)" },
          { transform: "scale(1)" }
        ],
        { duration: durasi(300), easing: "ease-out" }
      );

      setTimeout(() => {
        tombol.textContent = "📋 Salin petunjuk";
      }, 1800);
    }
  );

});