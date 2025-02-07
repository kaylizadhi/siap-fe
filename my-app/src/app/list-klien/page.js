"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Button from "components/Button";

const caudex = Caudex({
  weight: "700",
  subsets: ["latin"],
});

const styles = {
  tableContainerSurvei: "w-full text-center font-[Caudex] border-collapse border-spacing-0 border-separate border-spacing-y-2",
  buttonSurvei: "border-none bg-none cursor-pointer",
  iconSurvei: "mt-1 w-8 h-8 cursor-pointer px-2 rounded-[20px] py-2",
};

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}klien/${selectedKlien.id}/delete/`, {
          method: "DELETE",
        });

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
      <div className={`${caudex.className} flex justify-center items-center min-h-screen`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${caudex.className} flex justify-center items-center min-h-screen`}>
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
        <Button onClick={handleTambahKlien} variant="primary" className="flex items-center">
          <span className="text-3xl mr-2">+</span>
          <span className="text-sm">Tambah Klien</span>
        </Button>
      </div>

      {/* Search Box */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input type="text" placeholder="Cari berdasarkan nama klien, perusahaan, atau daerah..." className={`w-full pl-14 pr-6 py-3 rounded-full border-2 border-gray-200 outline-none bg-transparent text-gray-600 text-sm ${caudex.className} focus:border-primary-900 transition-colors`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Table */}
      <table className={styles.tableContainerSurvei}>
        <thead>
          <tr>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[10%]">No</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[25%]">Nama Klien</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[25%]">Nama Perusahaan</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[25%]">Daerah</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[15%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {kliens.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-500">
                {searchQuery ? "Tidak ada klien yang ditemukan" : "Belum ada klien yang ditambahkan"}
              </td>
            </tr>
          ) : (
            kliens.map((klien, index) => (
              <tr key={klien.id} className="outline-[1px] outline outline-[#bbc7cd] rounded-[28px] bg-white">
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{klien.nama_klien}</td>
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{klien.nama_perusahaan}</td>
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{klien.daerah}</td>
                <td className="p-4">
                  <div className="flex justify-center space-x-1">
                    <button onClick={() => handleDetail(klien.id)} className={styles.buttonSurvei} title="View Details">
                      <EyeIcon className={styles.iconSurvei} />
                    </button>
                    <button onClick={() => handleUpdate(klien.id)} className={styles.buttonSurvei} title="Edit">
                      <PencilIcon className={styles.iconSurvei} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedKlien(klien);
                        setIsModalOpen(true);
                      }}
                      className={styles.buttonSurvei}
                      title="Delete"
                    >
                      <TrashIcon className={styles.iconSurvei} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-end items-center space-x-8 px-8">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`flex items-center space-x-1 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-gray-500"}`}>
            <span>&lt;</span>
            <span>Sebelumnya</span>
          </button>

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`flex items-center space-x-1 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-gray-500"}`}>
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
              <Button onClick={handleDelete} variant="danger" className="px-4 py-2">
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
