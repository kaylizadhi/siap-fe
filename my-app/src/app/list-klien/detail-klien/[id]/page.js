"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for navigation
import { Caudex } from "next/font/google";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function KlienDetail({ params }) {
  const { id } = params;
  const [klien, setKlien] = useState(null);
  const router = useRouter(); // Initialize router for navigation

  // Fetch client details
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/klien/${id}/`)
        .then((response) => response.json())
        .then((data) => setKlien(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  // Handle update logic
  const handleUpdate = () => {
    router.push(`/list-klien/update/${id}`); // Navigate to update page
  };

  // Handle delete logic
  const handleDelete = () => {
    fetch(`http://localhost:8000/klien/${id}/delete/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Client deleted successfully");
          router.push("/list-klien"); // Redirect back to Daftar Klien after deletion
        } else {
          alert("Failed to delete client");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  if (!klien) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1
        className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}
      >
        Detail Klien
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nama Klien:
          </label>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {klien.nama_klien}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nama Perusahaan:
          </label>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {klien.nama_perusahaan}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Daerah:
          </label>
          <p className="mt-1 text-lg text-gray-800">{klien.daerah}</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => router.push("/list-klien")}
          >
            Back
          </button>

          <div className="flex space-x-4">
            {/* Update Button */}
            <button
              onClick={handleUpdate}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
