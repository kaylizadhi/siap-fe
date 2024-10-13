"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigation between pages
import { Caudex } from "next/font/google";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DaftarKlien() {
  const [kliens, setKliens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const router = useRouter();

  useEffect(() => {
    // Fetch the clients from the Django API
    const fetchKliens = async () => {
      try {
        const response = await fetch("http://localhost:8000/klien/"); // Update with your actual API URL
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

  // Filter clients based on search query
  const filteredKliens = kliens.filter((klien) =>
    klien.nama_klien.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to the "Tambah Klien" page
  const handleTambahKlien = () => {
    router.push("/daftar-klien"); // Adjust this path based on your actual routing
  };

  // Navigation for actions
  const handleDetail = (id) => {
    router.push(`/list-klien/detail-klien/${id}`);
  };

  const handleUpdate = (id) => {
    router.push(`/list-klien/update/${id}`);
  };

  const handleDelete = async (id) => {
    // Delete the client
    try {
      const response = await fetch(
        `http://localhost:8000/klien/${id}/delete/`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Remove the client from the state after successful deletion
        setKliens(kliens.filter((klien) => klien.id !== id));
      } else {
        throw new Error("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="16px"
          className="fill-gray-600 mr-3 rotate-90"
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
        </svg>
        <input
          type="text"
          placeholder="Cari Klien"
          className="w-full outline-none bg-transparent text-gray-600 text-sm"
          value={searchQuery} // Bind input value to searchQuery state
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
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
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                  onClick={() => handleDelete(klien.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
