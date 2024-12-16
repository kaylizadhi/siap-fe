"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Caudex } from "next/font/google";
import Button from "components/Button";

const caudex = Caudex({
  weight: "700",
  subsets: ["latin"],
});

export default function BuatSurvei() {
  const [survei, setSurvei] = useState({});
  const [klien, setKlien] = useState([]);
  const [daerahOptions, setDaerahOptions] = useState([]);
  const router = useRouter();
  const [wilayahSurvei, setWilayahSurvei] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBackToSurvei = () => {
    router.push("/survei");
  };

  const fetchKlien = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}klien/?page=1&page_size=10000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (Array.isArray(data.results)) {
        setKlien(data.results);
      } else {
        console.error("Respons klien bukan array:", data);
        setKlien([]);
        toast.error("Gagal memuat data klien");
      }
    } catch (error) {
      console.error("Error fetching klien:", error);
      setKlien([]);
      toast.error("Gagal memuat data klien");
    }
  };

  const fetchDaerah = async (param) => {
    try {
      const token = localStorage.getItem("authToken");
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}survei/count-by-region?ruang_lingkup=${param}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token ? `Token ${token}` : "",
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
        toast.error("Format data daerah tidak sesuai");
      }
    } catch (error) {
      console.error("Error fetching daerah:", error);
      setDaerahOptions([]);
      toast.error("Gagal memuat data daerah");
    }
  };

  const resetRuangLingkup = () => {
    const confirmReset = window.confirm("Reset ruang lingkup akan menghapus daftar wilayah yang sudah ditambahkan. Lanjutkan?");
    if (confirmReset) {
      setWilayahSurvei([]);
      setSurvei({ ...survei, ruang_lingkup: null });
      setDaerahOptions([]);
      document.querySelectorAll("input[name='ruanglingkup']").forEach((input) => (input.disabled = false));
      toast.info("Ruang lingkup telah direset");
    }
  };

  useEffect(() => {
    fetchKlien();
  }, []);

  const handleRuangLingkupChange = (event) => {
    const value = event.target.value;

    if (wilayahSurvei.length > 0) {
      const confirmReset = window.confirm("Mengubah ruang lingkup akan menghapus daftar wilayah yang sudah ditambahkan. Lanjutkan?");
      if (!confirmReset) return;
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
        toast.error("Data daerah tidak ditemukan");
        return;
      }

      if (!wilayahSurvei.some((item) => item.id === selectedId)) {
        setWilayahSurvei([...wilayahSurvei, selectedDaerah]);
        document.querySelectorAll("input[name='ruanglingkup']").forEach((input) => (input.disabled = true));
        toast.success("Daerah berhasil ditambahkan");
      } else {
        toast.warning(`${selectedDaerah.name} sudah ada dalam daftar`);
      }
    } else {
      toast.error("Pilih daerah terlebih dahulu");
    }
  };

  const removeDaerah = (id) => {
    setWilayahSurvei(wilayahSurvei.filter((item) => item.id !== id));
    toast.success("Daerah berhasil dihapus");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation checks
    const validationChecks = [
      { condition: !survei.nama_survei, message: "Judul survei tidak boleh kosong" },
      { condition: !survei.harga_survei || isNaN(survei.harga_survei), message: "Harga survei tidak valid" },
      { condition: !survei.jumlah_responden || isNaN(survei.jumlah_responden), message: "Jumlah responden tidak valid" },
      { condition: !survei.waktu_mulai_survei, message: "Tanggal mulai harus diisi" },
      { condition: !survei.waktu_berakhir_survei, message: "Tanggal berakhir harus diisi" },
      { condition: !survei.klien_id, message: "Pilih klien terlebih dahulu" },
      { condition: !survei.ruang_lingkup, message: "Pilih ruang lingkup survei" },
      { condition: wilayahSurvei.length === 0, message: "Tambahkan minimal satu wilayah survei" },
    ];

    for (const check of validationChecks) {
      if (check.condition) {
        toast.error(check.message);
        setLoading(false);
        return;
      }
    }

    try {
      const surveiData = { ...survei, wilayah_survei: wilayahSurvei };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/add-survei/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveiData),
      });

      if (response.ok) {
        toast.success("Survei berhasil ditambahkan");
        setTimeout(() => {
          router.push("/survei");
        }, 500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan survei");
      }
    } catch (error) {
      console.error("Error submitting survei:", error);
      setError("Gagal menambahkan survei");
      toast.error("Gagal menambahkan survei");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${caudex.className} p-6`}>
      <h1 className="text-4xl font-bold mb-6 text-primary-900">Tambah Survei</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Judul Survei</label>
          <input type="text" placeholder="Masukkan judul survei" onChange={(event) => setSurvei({ ...survei, nama_survei: event.target.value })} className="border rounded-md p-2" required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Nama Klien</label>
          <select onChange={(event) => setSurvei({ ...survei, klien_id: event.target.value })} className="border rounded-md p-2" required>
            <option value="">Pilih Klien</option>
            {klien.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nama_klien}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Ruang Lingkup Survei</label>
          <div className="flex space-x-4">
            {["Nasional", "Provinsi", "Kota"].map((scope) => (
              <label key={scope} className="inline-flex items-center">
                <input type="radio" name="ruanglingkup" value={scope} onChange={handleRuangLingkupChange} />
                <span className="ml-2">{scope}</span>
              </label>
            ))}
          </div>
          {survei.ruang_lingkup && (
            <button type="button" onClick={resetRuangLingkup} className="mt-2 text-sm text-red-600 hover:text-red-700">
              Reset Ruang Lingkup
            </button>
          )}
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Daerah</label>
          <div className="flex items-center space-x-2">
            <select id="daerahSelect" className="border rounded-md p-2 flex-1">
              <option value="">Pilih Daerah</option>
              {daerahOptions.map((daerah) => (
                <option key={daerah.id} value={daerah.id}>
                  {daerah.type === "city" ? `${daerah.name} (${daerah.province})` : daerah.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={addDaerah} className="p-2">
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {wilayahSurvei.map((daerah) => (
              <li key={daerah.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span>{daerah.type === "city" ? `${daerah.name} (${daerah.province})` : daerah.name}</span>
                <button type="button" onClick={() => removeDaerah(daerah.id)} className="text-red-600 hover:text-red-700">
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Harga</label>
          <input type="number" placeholder="Masukkan harga" onChange={(event) => setSurvei({ ...survei, harga_survei: event.target.value })} className="border rounded-md p-2" required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Jumlah Responden</label>
          <input type="number" placeholder="Masukkan jumlah responden" onChange={(event) => setSurvei({ ...survei, jumlah_responden: event.target.value })} className="border rounded-md p-2" required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Tanggal Mulai</label>
          <input type="date" min={new Date().toISOString().split("T")[0]} onChange={(event) => setSurvei({ ...survei, waktu_mulai_survei: event.target.value })} className="border rounded-md p-2" required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Tanggal Berakhir</label>
          <input type="date" min={new Date().toISOString().split("T")[0]} onChange={(event) => setSurvei({ ...survei, waktu_berakhir_survei: event.target.value })} className="border rounded-md p-2" required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold">Tipe Survei</label>
          <select onChange={(event) => setSurvei({ ...survei, tipe_survei: event.target.value })} className="border rounded-md p-2" required>
            <option value="Paper-based">Paper-based</option>
            <option value="Digital">Digital</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="flex flex-col w-1/2 mt-6">
          <Button className="mb-4" type="submit" variant="primary" disabled={loading}>
            Simpan
          </Button>
          <Button onClick={handleBackToSurvei} variant="secondary">
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
