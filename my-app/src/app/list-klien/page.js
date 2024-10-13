"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import Toast from "components/Toast";

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

  const filteredKliens = kliens.filter((klien) =>
    klien.nama_klien.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
            <tr
              key={klien.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M480 600q71 0 135-27.5t115-78.5q18-17 33-35t29-39q13-20 13-43t-13-43q-13-20-28-39.5T730 249q-51-51-115-78.5T480 143q-71 0-135 27.5T230 249q-18 17-33 35t-29 39q-13 20-13 43t13 43q13 20 28 39.5T230 515q51 51 115 78.5T480 600Zm0-225q-38 0-64.5-26.5T389 284q0-38 26.5-64.5T480 193q38 0 64.5 26.5T571 284q0 38-26.5 64.5T480 375ZM480 720q-124 0-236-67.5T84 500q-5-7-10-13.5T64 472q5-12 10-18t10-13q68-100 180-167t236-67q124 0 236 67t180 167q5 7 10 13t10 18q-5 12-10 18t-10 13q-68 100-180 167T480 720Zm0-220Zm0 136q86 0 168-39.5T784 500q-64-91-146-130.5T480 330q-86 0-168 39.5T176 500q64 91 146 130.5T480 636Zm0-136Z" />
                  </svg>
                </button>

                {/* Update Action */}
                <button
                  onClick={() => handleUpdate(klien.id)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M21.7 5.6l-3.3-3.3c-.8-.8-2-.8-2.8 0l-12 12v4.2c0 .5.5 1 1 1h4.2l12-12c.7-.8.7-2 0-2.9zM7.2 19H5v-2.2L14 7.8 16.2 10 7.2 19zM17 9.2L14.8 7 16.2 5.6 18.4 8 17 9.2z" />
                  </svg>
                </button>

                {/* Delete Action */}
                <button
                  onClick={() => {
                    setSelectedKlien(klien);
                    setIsModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 96 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M261 916q-24.75 0-42.375-17.625T201 856V336h-80v-60h214v-40h290v40h214v60h-80v520q0 24.75-17.625 42.375T699 916H261Zm438-580H261v520h438V336Zm-317 440h60V456h-60v320Zm180 0h60V456h-60v320ZM261 336v520-520Z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isModalOpen && selectedKlien && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete &quot;{selectedKlien.nama_klien}
              &quot;?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
