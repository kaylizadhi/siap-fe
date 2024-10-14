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
                  className="text-green-500 hover:text-green-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 96 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M194 921q-17 0-28.5-11.5T154 881V709q0-17 11.5-28.5T194 669h42q17 0 28.5 11.5T276 709v172q0 17-11.5 28.5T236 921h-42Zm236-1q-17 0-28.5-11.5T390 881V576q0-17 11.5-28.5T430 536h42q17 0 28.5 11.5T512 576v305q0 17-11.5 28.5T472 921h-42Zm236 0q-17 0-28.5-11.5T626 881V404q0-17 11.5-28.5T666 364h42q17 0 28.5 11.5T748 404v477q0 17-11.5 28.5T708 921h-42Zm236 0q-17 0-28.5-11.5T862 881V246q0-17 11.5-28.5T902 206h42q17 0 28.5 11.5T984 246v635q0 17-11.5 28.5T944 921h-42Z" />
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
                    <path d="M261 961q-34 0-56.5-23T182 881V328h-56q-17 0-28.5-11.5T86 288q0-17 11.5-28.5T126 248h194v-34q0-28 19-47t47-19h178q28 0 47 19t19 47v34h194q17 0 28.5 11.5T874 288q0 17-11.5 28.5T834 328h-56v553q0 34-23 57t-56 23H261Zm402-633H297v553h366V328Zm-255 481q0 17 11.5 28.5T447 849q17 0 28.5-11.5T487 809V529q0-17-11.5-28.5T447 489q-17 0-28.5 11.5T407 529v280Zm160 0q0 17 11.5 28.5T607 849q17 0 28.5-11.5T647 809V529q0-17-11.5-28.5T607 489q-17 0-28.5 11.5T567 529v280ZM407 248h146v-34H407v34Zm-110 80v553-553Z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
}
