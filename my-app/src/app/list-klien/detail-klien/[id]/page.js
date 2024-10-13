"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import Toast from "components/Toast";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function KlienDetail({ params }) {
  const { id } = params;
  const [klien, setKlien] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

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
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/klien/${id}/delete/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setToastMessage("Klien berhasil dihapus!"); // Set success message
        setShowToast(true); // Show toast message

        setTimeout(() => {
          router.push("/list-klien");
        }, 500);
      } else {
        alert("Gagal menghapus klien.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

            {/* Delete Button (open confirmation modal) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Delete Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this client?</p>
            <div className="flex justify-end space-x-4 mt-6">
              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              {/* Confirm Delete Button */}
              <button
                onClick={() => {
                  handleDelete();
                  setIsModalOpen(false); // Close the modal
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Component */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)} // Hide toast after it is displayed
      />
    </div>
  );
}
