"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/solid";
import styles from "../../index.module.css";

export default function EditSurvei() {
  const router = useRouter();
  const params = useParams();
  const [klien, setKlien] = useState([]);
  const [daerahOptions, setDaerahOptions] = useState([]);
  const id = params.id;
  const [survei, setSurvei] = useState({});
  const [wilayahSurvei, setWilayahSurvei] = useState([]);

  useEffect(() => {
    async function fetchingData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/survei/get-survei-detail/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const listSurvei = await res.json();
        setSurvei(listSurvei);

        // If wilayah_survei is a string, convert it to an array for consistency
        if (listSurvei.wilayah_survei && typeof listSurvei.wilayah_survei === "string") {
          setWilayahSurvei([
            {
              id: listSurvei.wilayah_survei,
              name: listSurvei.wilayah_survei,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    if (id) {
      fetchingData();
    }
  }, [id]);

  const fetchDaerah = async (param) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/survei/count-by-region?ruang_lingkup=${param}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
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

  const fetchKlien = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/klien/?page=1&page_size=10000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setKlien(data.results);
    } catch (error) {
      console.error("Error fetching klien:", error);
      setKlien([]);
    }
  };

  useEffect(() => {
    fetchKlien();
  }, []);

  const handleRuangLingkupChange = (event) => {
    const value = event.target.value;

    // If wilayah_survei already has items, confirm reset
    if (wilayahSurvei.length > 0) {
      const confirmReset = confirm("Mengubah ruang lingkup akan menghapus daftar wilayah yang sudah ditambahkan. Lanjutkan?");
      if (!confirmReset) return;

      // Reset wilayah survei if user agrees
      setWilayahSurvei([]);
    }

    setSurvei({ ...survei, ruang_lingkup: value });
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

    // Re-enable radio buttons if no regions are selected
    if (wilayahSurvei.length <= 1) {
      document.querySelectorAll("input[name='ruanglingkup']").forEach((input) => (input.disabled = false));
    }
  };

  const resetRuangLingkup = () => {
    const confirmReset = confirm("Reset ruang lingkup akan menghapus daftar wilayah yang sudah ditambahkan. Lanjutkan?");
    if (confirmReset) {
      setWilayahSurvei([]);
      setSurvei({ ...survei, ruang_lingkup: null });
      setDaerahOptions([]);

      // Enable radio buttons
      document.querySelectorAll("input[name='ruanglingkup']").forEach((input) => (input.disabled = false));
    }
  };

  const handleBackToSurvei = () => {
    router.push("/survei");
  };

  const handleSubmit = async () => {
    // Validation
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
      const surveiData = {
        ...survei,
        wilayah_survei: wilayahSurvei.length > 0 ? wilayahSurvei : survei.wilayah_survei,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/update-survei/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveiData),
      });
      const result = await response.json();
      if (result?.success) {
        router.push("/survei");
      }
    } catch (error) {
      console.log("response", survei);
      alert("Gagal menyimpan perubahan informasi survei");
    }
  };

  return (
    <div>
      <b className={styles.headingSurvei}>Edit Survei</b>
      <div className={styles.containerSurvei}>
        <b className={styles.textFieldTitleSurvei}>Judul Survei</b>
        <input className={styles.textFieldSurvei} type="text" name="judulsurvei" value={survei.nama_survei || ""} onChange={(event) => setSurvei({ ...survei, nama_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Nama Klien</b>
        <select className={styles.textFieldSurveiDropdown} value={survei.klien_id || ""} onChange={(event) => setSurvei({ ...survei, klien_id: event.target.value })}>
          <option value="">Pilih Klien</option>
          {klien.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nama_klien}
            </option>
          ))}
        </select>

        <b className={styles.textFieldTitleSurvei}>Ruang Lingkup Survei</b>
        <div className={styles.radioGroupSurvei}>
          {["Nasional", "Provinsi", "Kota"].map((scope) => (
            <label key={scope}>
              <input type="radio" name="ruanglingkup" value={scope} checked={survei.ruang_lingkup === scope} onChange={handleRuangLingkupChange} />
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
          {/* If no regions added from dropdown, show current wilayah as read-only */}
          {wilayahSurvei.length === 0 && survei.wilayah_survei && (
            <li>
              {survei.wilayah_survei}
              <span style={{ color: "gray", marginLeft: "10px" }}>(Wilayah Saat Ini)</span>
            </li>
          )}
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
        <input className={styles.textFieldSurvei} type="number" value={survei.harga_survei || ""} onChange={(event) => setSurvei({ ...survei, harga_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Jumlah Responden</b>
        <input className={styles.textFieldSurvei} type="number" value={survei.jumlah_responden || ""} onChange={(event) => setSurvei({ ...survei, jumlah_responden: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Tanggal Mulai</b>
        <input min={new Date().toISOString().split("T")[0]} className={styles.textFieldSurvei} type="date" value={survei.waktu_mulai_survei ? survei.waktu_mulai_survei.split("T")[0] : ""} onChange={(event) => setSurvei({ ...survei, waktu_mulai_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Tanggal Berakhir</b>
        <input min={new Date().toISOString().split("T")[0]} className={styles.textFieldSurvei} type="date" value={survei.waktu_berakhir_survei ? survei.waktu_berakhir_survei.split("T")[0] : ""} onChange={(event) => setSurvei({ ...survei, waktu_berakhir_survei: event.target.value })} />

        <b className={styles.textFieldTitleSurvei}>Tipe Survei</b>
        <select className={styles.textFieldSurveiDropdown} value={survei.tipe_survei || ""} onChange={(event) => setSurvei({ ...survei, tipe_survei: event.target.value })}>
          <option value="Paper-based">Paper-based</option>
          <option value="Digital">Digital</option>
          <option value="Lainnya">Lainnya</option>
        </select>

        <button onClick={handleSubmit} className={styles.primaryButtonSurvei}>
          Simpan
        </button>
        <button onClick={handleBackToSurvei} className={styles.secondaryButtonSurvei}>
          Batal
        </button>
      </div>
    </div>
  );
}
