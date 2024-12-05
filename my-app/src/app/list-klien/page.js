"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import Button from "components/Button";

const caudex = Caudex({
  weight: "700",
  subsets: ["latin"],
});

export default function DaftarKlien() {
  const [kliens, setKliens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKlien, setSelectedKlien] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const router = useRouter();

  // Function to fetch clients with pagination
  const fetchKliens = async (page = 1, search = "") => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}klien/?page=${page}&page_size=${pageSize}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setKliens(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
      setTotalItems(data.total_items);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchKliens();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchKliens(newPage, searchQuery);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchKliens(1, searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
          `${process.env.NEXT_PUBLIC_BASE_URL}klien/${selectedKlien.id}/delete/`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Refresh the current page after deletion
          fetchKliens(currentPage, searchQuery);
          setIsModalOpen(false);
          setSelectedKlien(null);
          toast.success("Klien berhasil dihapus!");
        } else {
          throw new Error("Failed to delete client");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Gagal menghapus klien.");
      }
    }
  };

  if (loading && !kliens.length) {
    return (
      <div
        className={`${caudex.className} flex justify-center items-center min-h-screen`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${caudex.className} flex justify-center items-center min-h-screen`}
      >
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`${caudex.className} p-6`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary-900">Daftar Klien</h1>
          <p className="text-gray-600 mt-2">
            Total {totalItems} klien {searchQuery && "ditemukan"}
          </p>
        </div>
        <Button
          onClick={handleTambahKlien}
          variant="primary"
          className="flex items-center"
        >
          <span className="text-3xl mr-2">+</span>
          <span className="text-sm">Tambah Klien</span>
        </Button>
      </div>

      {/* Search Box */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari berdasarkan nama klien, perusahaan, atau daerah..."
          className={`w-full pl-14 pr-6 py-3 rounded-full border-2 border-gray-200 outline-none bg-transparent text-gray-600 text-sm ${caudex.className} focus:border-primary-900 transition-colors`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 px-8 py-3 text-xs text-gray-500 uppercase font-medium bg-gray-50 rounded-t-lg">
        <div>Nama Klien</div>
        <div>Nama Perusahaan</div>
        <div>Daerah</div>
        <div className="text-center">Action</div>
      </div>

      {/* Table Body */}
      <div className="space-y-3">
        {kliens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "Tidak ada klien yang ditemukan"
              : "Belum ada klien yang ditambahkan"}
          </div>
        ) : (
          kliens.map((klien) => (
            <div
              key={klien.id}
              className="grid grid-cols-4 gap-4 px-8 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div>
                <p className="font-bold text-gray-700">{klien.nama_klien}</p>
              </div>
              <div className="text-gray-500">{klien.nama_perusahaan}</div>
              <div className="text-gray-500">{klien.daerah}</div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleDetail(klien.id)}
                  className="p-2 text-primary-700 hover:bg-primary-50 rounded-full transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleUpdate(klien.id)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedKlien(klien);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-end items-center space-x-8 px-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center space-x-1 ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-gray-500"
            }`}
          >
            <span>&lt;</span>
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center space-x-1 ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-gray-500"
            }`}
          >
            <span>Selanjutnya</span>
            <span>&gt;</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus klien &quot;
              {selectedKlien?.nama_klien}&quot;?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedKlien(null);
                }}
                variant="secondary"
                className="px-4 py-2"
              >
                Batal
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="px-4 py-2"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
