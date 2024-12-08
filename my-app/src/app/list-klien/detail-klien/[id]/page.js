"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Button from "components/Button"; // Importing the Button component

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

// KlienDetail component
export default function KlienDetail({ params }) {
  const { id } = params;
  const [klien, setKlien] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Fetch client details
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/klien/${id}/`)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/klien/${id}/delete/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Klien berhasil dihapus!"); // Show success toast
        setTimeout(() => {
          router.push("/list-klien");
        }, 500);
      } else {
        toast.error("Gagal menghapus klien."); // Show error toast
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat menghapus klien."); // Show error toast
    }
  };

  if (!klien) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}>Detail Klien</h1>
      <div className="bg-white rounded-lg max-w-lg">
        <div className="mb-4">
          <label className={`block text-sm font-medium text-gray-700 ${caudex.className}`}>Nama Klien:</label>
          <p className={`mt-1 text-lg font-bold text-gray-800 ${caudex.className}`}>{klien.nama_klien}</p>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium text-gray-700 ${caudex.className}`}>Nama Perusahaan:</label>
          <p className={`mt-1 text-lg font-semibold text-gray-800 ${caudex.className}`}>{klien.nama_perusahaan}</p>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium text-gray-700 ${caudex.className}`}>Daerah:</label>
          <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>{klien.daerah}</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <Button
            variant="primary" // Assuming "primary" is a variant for the button
            onClick={() => router.push("/list-klien")}
            className="flex items-center px-6 py-3" // Increased padding for the back button
          >
            <span className={`text-sm ${caudex.className}`}>Kembali</span>
          </Button>

          <div className="flex space-x-4">
            {/* Update Button */}
            <Button
              variant="secondary" // Changed to secondary variant
              onClick={handleUpdate}
              className="px-3 py-2" // Increased padding for the update button
            >
              <span className={`${caudex.className}`}>Update</span>
            </Button>

            {/* Delete Button (open confirmation modal) */}
            <Button
              variant="secondary" // Changed to secondary variant
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2" // Increased padding for the delete button
            >
              <span className={`${caudex.className}`}>Delete</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Modal for Delete Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus klien &quot;{klien.nama_klien}
              &quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setIsModalOpen(false)} variant="modalCancel">
                Batal
              </Button>
              <Button
                onClick={() => {
                  handleDelete();
                  setIsModalOpen(false); // Close the modal
                }}
                variant="modalDelete"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Removed ToastContainer from here */}
    </div>
  );
}
