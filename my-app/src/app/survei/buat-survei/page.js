"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../index.module.css";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function BuatSurvei() {
  const [survei, setSurvei] = useState({});
  const [klien, setKlien] = useState([]); // Inisialisasi sebagai array
  const [daerahOptions, setDaerahOptions] = useState([]);
  const router = useRouter();
  const [wilayahSurvei, setWilayahSurvei] = useState([]);

  const handleBackToSurvei = () => {
    router.push("/survei");
  };

  // Fungsi untuk mengambil data klien dari API
  const fetchKlien = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/klien/?page=1&page_size=10000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Pastikan respons adalah array
      if (Array.isArray(data.results)) {
        setKlien(data.results);
      } else {
        console.error("Respons klien bukan array:", data);
        setKlien([]);
      }
    } catch (error) {
      console.error("Error fetching klien:", error);
      setKlien([]);
    }
  };

  const fetchDaerah = async (param) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/survei/count-by-region?ruang_lingkup=${param}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // For debugging

      if (Array.isArray(data)) {
        // Use the data directly since it's already in the correct format
        setDaerahOptions(data);
      } else {
        console.error("Response daerah tidak sesuai format: ", data);
        setDaerahOptions([]);
      }
    } catch (error) {
      console.error("Error fetching daerah:", error);
      setDaerahOptions([]);
    }
  };

  const resetRuangLingkup = () => {
    const confirmReset = confirm("Reset ruang lingkup akan menghapus daftar wilayah yang sudah ditambahkan. Lanjutkan?");
    if (confirmReset) {
      setWilayahSurvei([]);
      setSurvei({ ...survei, ruang_lingkup: null });
      setDaerahOptions([]);

      // Aktifkan kembali pilihan ruang lingkup
      document.querySelectorAll("input[name='ruanglingkup']").forEach((input) => (input.disabled = false));
    }
  };

  useEffect(() => {
    fetchKlien(); // Ambil data klien saat pertama kali render
  }, []);

  const handleRuangLingkupChange = (event) => {
    const value = event.target.value;

    // Cek apakah sudah ada wilayah survei yang ditambahkan
    if (wilayahSurvei.length > 0) {
      const confirmReset = confirm("Mengubah ruang lingkup akan menghapus daftar wilayah yang sudah ditambahkan. Lanjutkan?");
      if (!confirmReset) return;

      // Reset wilayah survei jika pengguna setuju
      setWilayahSurvei([]);
    }

    // Set ruang lingkup baru
    setSurvei({ ...survei, ruang_lingkup: value });

    // Ambil data daerah berdasarkan ruang lingkup baru
    fetchDaerah(value);
  };

  const addDaerah = () => {
    const daerahSelect = document.getElementById("daerahSelect");
    const selectedId = daerahSelect.value;

    if (selectedId) {
      const selectedDaerah = daerahOptions.find((d) => d.id === selectedId);
      if (!selectedDaerah) {
        alert("Data daerah tidak ditemukan.");
        return;
      }

      if (!wilayahSurvei.some((item) => item.id === selectedId)) {
        setWilayahSurvei([...wilayahSurvei, selectedDaerah]);
        document.querySelectorAll("input[name='ruanglingkup']").forEach((input) => (input.disabled = true));
      } else {
        alert(`${selectedDaerah.name} sudah ada dalam daftar.`);
      }
    } else {
      alert("Pilih daerah terlebih dahulu.");
    }
  };

  const removeDaerah = (id) => {
    setWilayahSurvei(wilayahSurvei.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload halaman
    if (!survei.nama_survei) {
      alert("Judul survei tidak boleh kosong.");
      return;
    }
    if (!survei.harga_survei || isNaN(survei.harga_survei)) {
      alert("Harga survei tidak boleh kosong.");
      return;
    }
    if (!survei.jumlah_responden || isNaN(survei.jumlah_responden)) {
      alert("Jumlah responden tidak boleh kosong.");
      return;
    }

    try {
      const surveiData = { ...survei, wilayah_survei: wilayahSurvei };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/survei/add-survei/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveiData),
      });
      const result = await response.json();
      console.log(result);

      if (response?.ok) {
        router.push("/survei");
      }
    } catch (error) {
      console.error("Error submitting survei:", error);
      router.push("/survei");
    }
  };

  return (
    <div>
      <b className={styles.headingSurvei}>Daftar Survei</b>
      <form onSubmit={handleSubmit} className={styles.containerSurvei}>
        <b className={styles.textFieldTitleSurvei}>Judul Survei</b>
        <input className={styles.textFieldSurvei} type="text" placeholder="Masukkan judul survei" onChange={(event) => setSurvei({ ...survei, nama_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Nama Klien</b>
        <select className={styles.textFieldSurveiDropdown} onChange={(event) => setSurvei({ ...survei, klien_id: event.target.value })}>
          <option value="">Pilih Klien</option>
          {klien.length > 0 ? (
            klien.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nama_klien}
              </option>
            ))
          ) : (
            <option disabled>Data klien tidak tersedia</option>
          )}
        </select>

        <b className={styles.textFieldTitleSurvei}>Ruang Lingkup Survei</b>
        <div className={styles.radioGroupSurvei}>
          {["Nasional", "Provinsi", "Kota"].map((scope) => (
            <label key={scope}>
              <input type="radio" name="ruanglingkup" value={scope} onChange={handleRuangLingkupChange} />
              {scope}
            </label>
          ))}
        </div>
        {survei.ruang_lingkup && (
          <button type="button" className={styles.resetButtonSurvei} onClick={resetRuangLingkup}>
            Reset Ruang Lingkup
          </button>
        )}

        <b className={styles.textFieldTitleSurvei}>Daerah</b>
        <ul className={styles.daerahList}>
          {wilayahSurvei.map((daerah) => (
            <li key={daerah.id}>
              {daerah.type === "city" ? `${daerah.name} (${daerah.province})` : daerah.name}
              <button style={{ marginLeft: "10px" }} type="button" onClick={() => removeDaerah(daerah.id)}>
                Hapus
              </button>
            </li>
          ))}
        </ul>

        <select id="daerahSelect" className={styles.textFieldSurveiDropdown}>
          <option value="">Pilih Daerah</option>
          {daerahOptions.map((daerah) => (
            <option key={daerah.id} value={daerah.id}>
              {daerah.type === "city" ? `${daerah.name} (${daerah.province})` : daerah.name}
            </option>
          ))}
        </select>
        <PlusIcon className={styles.iconPlus} onClick={addDaerah} />

        <b className={styles.textFieldTitleSurvei}>Harga</b>
        <input className={styles.textFieldSurvei} type="number" placeholder="Masukkan harga" onChange={(event) => setSurvei({ ...survei, harga_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Jumlah Responden</b>
        <input className={styles.textFieldSurvei} type="number" placeholder="Masukkan jumlah responden" onChange={(event) => setSurvei({ ...survei, jumlah_responden: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Tanggal Mulai</b>
        <input min={new Date().toISOString().split("T")[0]} className={styles.textFieldSurvei} type="date" onChange={(event) => setSurvei({ ...survei, waktu_mulai_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Tanggal Berakhir</b>
        <input min={new Date().toISOString().split("T")[0]} className={styles.textFieldSurvei} type="date" onChange={(event) => setSurvei({ ...survei, waktu_berakhir_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Tipe Survei</b>
        <select className={styles.textFieldSurveiDropdown} onChange={(event) => setSurvei({ ...survei, tipe_survei: event.target.value })}>
          <option value="Paper-based">Paper-based</option>
          <option value="Digital">Digital</option>
          <option value="Lainnya">Lainnya</option>
        </select>

        <button type="submit" className={styles.primaryButtonSurvei}>
          Simpan
        </button>
        <button type="button" onClick={handleBackToSurvei} className={styles.secondaryButtonSurvei}>
          Batal
        </button>
      </form>
    </div>
  );
}
