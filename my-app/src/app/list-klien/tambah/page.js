"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Caudex } from "next/font/google";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Button from "components/Button"; // Import the Button component

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DaftarKlien() {
  const [formData, setFormData] = useState({
    nama_klien: "",
    nama_perusahaan: "",
    daerah: "",
  });

  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/klien/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.success("Klien berhasil ditambahkan!"); // Show success toast
      setError(null);
      setFormData({
        nama_klien: "",
        nama_perusahaan: "",
        daerah: "",
      });

      // Redirect to the list-klien page after success
      setTimeout(() => {
        router.push("/list-klien");
      }, 500); // Redirect after 500ms for toast visibility
    } catch (error) {
      setError("Gagal menambahkan klien.");
      toast.error("Gagal menambahkan klien."); // Show error toast
    }
  };

  const handleCancel = () => {
    setFormData({
      nama_klien: "",
      nama_perusahaan: "",
      daerah: "",
    });
    router.push("/list-klien"); // Redirect to the list-klien page on cancel
  };

  return (
    <div className={`p-6 ${caudex.className}`}>
      <h1 className="text-4xl font-bold mb-6 text-primary-900">Daftar Klien</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold" htmlFor="nama_klien">
            Nama Klien
          </label>
          <input type="text" id="nama_klien" name="nama_klien" placeholder="Masukkan nama klien" className="border rounded-md p-2" value={formData.nama_klien} onChange={handleChange} required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold" htmlFor="nama_perusahaan">
            Nama Perusahaan
          </label>
          <input type="text" id="nama_perusahaan" name="nama_perusahaan" placeholder="Masukkan nama perusahaan" className="border rounded-md p-2" value={formData.nama_perusahaan} onChange={handleChange} required />
        </div>

        <div className="flex flex-col w-1/2 mb-4">
          <label className="mb-1 font-semibold" htmlFor="daerah">
            Daerah
          </label>
          <input type="text" id="daerah" name="daerah" placeholder="Masukkan daerah" className="border rounded-md p-2" value={formData.daerah} onChange={handleChange} required />
        </div>

        <div className="flex flex-col w-1/2 mt-6">
          <Button className="mb-4" type="submit" variant="primary">
            Simpan
          </Button>
          <Button onClick={handleCancel} variant="secondary">
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
