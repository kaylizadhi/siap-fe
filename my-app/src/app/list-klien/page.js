"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "components/Button"; // Import the Button component

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DaftarKlien() {
  const [kliens, setKliens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKlien, setSelectedKlien] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchKliens = async () => {
      try {
        const response = await fetch("https://siap-be-production.up.railway.app/klien/");
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

  const filteredKliens = kliens.filter((klien) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      klien.nama_klien.toLowerCase().includes(lowerSearchQuery) ||
      klien.nama_perusahaan.toLowerCase().includes(lowerSearchQuery) ||
      klien.daerah.toLowerCase().includes(lowerSearchQuery)
    );
  });

  const handleTambahKlien = () => {
    router.push("/list-klien/tambah");
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
          `https://siap-be-production.up.railway.app/${selectedKlien.id}/delete/`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setKliens(kliens.filter((klien) => klien.id !== selectedKlien.id));
          setIsModalOpen(false);
          toast.success("Klien berhasil dihapus!"); // Show success toast
        } else {
          throw new Error("Failed to delete client");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Gagal menghapus klien."); // Show error toast
      }
    }
  };

  if (loading) return <p className={`${caudex.className}`}>Loading...</p>;
  if (error) return <p className={`${caudex.className}`}>Error: {error}</p>;

  return (
    <div className={`${caudex.className}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-4xl font-bold text-primary-900`}>Daftar Klien</h1>
        <Button
          onClick={handleTambahKlien}
          variant="primary"
          className="flex items-center"
        >
          <span className="text-3xl mr-2">+</span>
          <span className="text-sm">Tambah Klien</span>
        </Button>
      </div>

      <div className="w-full flex px-6 py-3 mb-6 rounded-full border-2 border overflow-hidden mx-auto font-[sans-serif]">
        <input
          type="text"
          placeholder="Cari Klien"
          className={`w-full outline-none bg-transparent text-gray-600 text-sm ${caudex.className}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Headers */}
      <div className="grid grid-cols-4 gap-4 px-8 py-3 text-xs text-gray-500 uppercase font-medium">
        <div>Nama Klien</div>
        <div>Nama Perusahaan</div>
        <div>Daerah</div>
        <div>Action</div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {filteredKliens.map((klien) => (
          <div
            key={klien.id}
            className="grid grid-cols-4 gap-4 px-8 py-3 bg-white rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div>
              <p className="font-bold text-gray-700">{klien.nama_klien}</p>
            </div>
            <div className="text-gray-500">{klien.nama_perusahaan}</div>
            <div className="text-gray-500">{klien.daerah}</div>
            <div>
              <div className="flex space-x-6">
                <button
                  onClick={() => handleDetail(klien.id)}
                  className="text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleUpdate(klien.id)}
                  className="text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => {
                    setSelectedKlien(klien);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus klien &quot;
              {selectedKlien?.nama_klien}&quot;?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="modalCancel"
              >
                Batal
              </Button>
              <Button onClick={handleDelete} variant="modalDelete">
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
