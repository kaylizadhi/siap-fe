"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Caudex } from "next/font/google";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DaftarKlien() {
  const [formData, setFormData] = useState({
    nama_klien: "",
    nama_perusahaan: "",
    daerah: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/klien/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setSuccess("Klien berhasil ditambahkan!");
      setError(null);
      setFormData({
        nama_klien: "",
        nama_perusahaan: "",
        daerah: "",
      });

      // Redirect to the list-klien page after success
      router.push("/list-klien");
    } catch (error) {
      setError("Gagal menambahkan klien.");
      setSuccess(null);
    }
  };

  return (
    <div>
      <div>
        <h1
          className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}
        >
          Daftar Klien
        </h1>

        {success && <div className="mb-4 text-green-500">{success}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="nama_klien"
            placeholder="Nama Klien"
            value={formData.nama_klien}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 mb-4 w-full"
            required
          />
          <input
            type="text"
            name="nama_perusahaan"
            placeholder="Nama Perusahaan"
            value={formData.nama_perusahaan}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 mb-4 w-full"
            required
          />
          <input
            type="text"
            name="daerah"
            placeholder="Daerah"
            value={formData.daerah}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 mb-4 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Tambah Klien
          </button>
        </form>
      </div>
    </div>
  );
}
