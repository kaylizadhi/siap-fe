"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import Toast from "components/Toast"; // Import the Toast component

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function UpdateKlien({ params }) {
  const { id } = params;
  const [formData, setFormData] = useState({
    nama_klien: "",
    nama_perusahaan: "",
    daerah: "",
  });

  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [showToast, setShowToast] = useState(false); // State for toast visibility
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/klien/${id}/`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/klien/${id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setToastMessage("Klien berhasil diupdate!"); // Set success message
      setShowToast(true); // Show toast message

      setError(null);

      // Redirect to the list-klien page after success
      setTimeout(() => {
        router.push("/list-klien");
      }, 500); // Redirect after 500ms for toast visibility
    } catch (error) {
      setError("Gagal mengupdate klien");
      setToastMessage(""); // Clear toast message on error
    }
  };

  return (
    <div>
      <div>
        <h1
          className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}
        >
          Update Klien
        </h1>

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
            Update
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
