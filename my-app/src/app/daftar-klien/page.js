"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Caudex } from "next/font/google";
import Toast from "components/Toast"; // Import the Toast component

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DaftarKlien() {
  const [formData, setFormData] = useState({
    nama_klien: "",
    nama_perusahaan: "",
    daerah: "",
  });

  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [showToast, setShowToast] = useState(false); // State for toast visibility
  const router = useRouter(); // Initialize useRouter

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}klien/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setToastMessage("Klien berhasil ditambahkan!"); // Set success message
      setShowToast(true); // Show toast message

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
      setToastMessage(""); // Clear toast message on error
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

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="nama_klien"
            placeholder="Masukkan nama klien"
            value={formData.nama_klien}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 mb-4 w-full"
            required
          />
          <input
            type="text"
            name="nama_perusahaan"
            placeholder="Masukkan nama perusahaan"
            value={formData.nama_perusahaan}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 mb-4 w-full"
            required
          />
          <input
            type="text"
            name="daerah"
            placeholder="Masukkan daerah"
            value={formData.daerah}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 mb-4 w-full"
            required
          />
          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Simpan
          </button>
          <button
              type="button"
              onClick={() => router.push("/list-klien")}
              className="border border-red-600 text-red-600 py-2 px-6 rounded-md"
            >
              Batal
            </button>
        </form>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)} // Hide toast after it is displayed
      />
    </div>
  );
}
