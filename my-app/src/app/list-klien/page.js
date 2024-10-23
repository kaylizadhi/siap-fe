"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import Toast from "components/Toast";
import { Eye, Pencil, Trash2 } from "lucide-react";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DaftarKlien() {
  const [kliens, setKliens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKlien, setSelectedKlien] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchKliens = async () => {
      try {
        const response = await fetch("http://localhost:8000/klien/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setKliens(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKliens();
  }, []);

  // Update filter to handle nama_klien, nama_perusahaan, and daerah
  const filteredKliens = kliens.filter((klien) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      klien.nama_klien.toLowerCase().includes(lowerSearchQuery) ||
      klien.nama_perusahaan.toLowerCase().includes(lowerSearchQuery) ||
      klien.daerah.toLowerCase().includes(lowerSearchQuery)
    );
  });

  const handleTambahKlien = () => {
    router.push("/daftar-klien");
  };

  const handleDetail = (id) => {
    router.push(`/list-klien/detail-klien/${id}`);
  };

  const handleUpdate = (id) => {
    router.push(`/list-klien/update/${id}`);
  };

  const handleDelete = async () => {
    if (selectedKlien) {
      try {
        const response = await fetch(
          `http://localhost:8000/klien/${selectedKlien.id}/delete/`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setKliens(kliens.filter((klien) => klien.id !== selectedKlien.id));
          setIsModalOpen(false);
          setToastMessage("Klien berhasil dihapus!");
          setShowToast(true);
        } else {
          throw new Error("Failed to delete client");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        setToastMessage("Gagal menghapus klien.");
        setShowToast(true);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Daftar Klien Heading and Tambah Klien Button */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-4xl font-bold text-primary-900 ${caudex.className}`}
        >
          Daftar Klien
        </h1>
        <button
          onClick={handleTambahKlien}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Tambah Klien
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full flex px-4 py-3 mb-3 rounded-md border-2 border overflow-hidden mx-auto font-[sans-serif]">
        <input
          type="text"
          placeholder="Cari Klien"
          className="w-full outline-none bg-transparent text-gray-600 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead>
          <tr>
            <th className="px-6 py-3 text-xs text-gray-500 uppercase">
              Select
            </th>
            <th className="px-6 py-3 text-xs text-gray-500 uppercase">
              Nama Klien
            </th>
            <th className="px-6 py-3 text-xs text-gray-500 uppercase">
              Nama Perusahaan
            </th>
            <th className="px-6 py-3 text-xs text-gray-500 uppercase">
              Daerah
            </th>
            <th className="px-6 py-3 text-xs text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredKliens.map((klien) => (
            <tr key={klien.id} className="bg-white border-b">
              <td>
                <div className="flex items-center pl-2 py-4">
                  <input
                    id={`checkbox-${klien.id}`}
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-gray-700">{klien.nama_klien}</p>
              </td>
              <td className="px-6 py-4">{klien.nama_perusahaan}</td>
              <td className="px-6 py-4">{klien.daerah}</td>
              <td className="px-6 py-4 flex space-x-4">
                {/* Detail Action */}
                <button
                  onClick={() => handleDetail(klien.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Eye size={20} />
                </button>

                {/* Update Action */}
                <button
                  onClick={() => handleUpdate(klien.id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <Pencil size={20} />
                </button>

                {/* Delete Action */}
                <button
                  onClick={() => {
                    setSelectedKlien(klien);
                    setIsModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
