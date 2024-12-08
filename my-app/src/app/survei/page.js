"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
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

export default function Index() {
  const [survei, setSurvei] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSurvei, setFilteredSurvei] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchingData() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/get-list-survei?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const listSurvei = await res.json();
        setSurvei(listSurvei.results);
        setTotalCount(listSurvei.count);
        setFilteredSurvei(listSurvei.results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchingData();
  }, [page]);

  useEffect(() => {
    const search = () => {
      let searched = survei;
      if (searchTerm) {
        searched = searched.filter((element) => (element.nama_survei && element.nama_survei.toLowerCase().includes(searchTerm.toLowerCase())) || (element.nama_klien && element.nama_klien.toLowerCase().includes(searchTerm.toLowerCase())));
      }
      setFilteredSurvei(searched);
    };
    search();
  }, [searchTerm, survei]);

  const handleDetail = (id) => {
    router.push(`/survei/${id}`);
  };

  const handleUpdate = (id) => {
    router.push(`/survei/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus survei ini?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/delete-survei/${id}/`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSurvei((prevSurvei) => prevSurvei.filter((e) => e.id !== id));
          setFilteredSurvei((prevSurvei) => prevSurvei.filter((e) => e.id !== id));
        } else {
          console.error("Gagal menghapus survei");
        }
      } catch (error) {
        console.error("Error muncul ketika menghapus survei", error);
      }
    }
  };

  const handleTambahSurvei = () => {
    router.push("/survei/buat-survei");
  };

  if (loading) {
    return (
      <div className={`${caudex.className} flex justify-center items-center min-h-screen`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className={`${caudex.className} p-6`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary-900">Daftar Survei</h1>
          <p className="text-gray-600 mt-2">
            Total {totalCount} survei {searchTerm && "ditemukan"}
          </p>
        </div>
        <Button onClick={handleTambahSurvei} variant="primary" className="flex items-center">
          <span className="text-3xl mr-2">+</span>
          <span className="text-sm">Tambah Survei</span>
        </Button>
      </div>

      {/* Search Box */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input type="text" placeholder="Cari berdasarkan judul survei atau nama klien..." className={`w-full pl-14 pr-6 py-3 rounded-full border-2 border-gray-200 outline-none bg-transparent text-gray-600 text-sm ${caudex.className} focus:border-primary-900 transition-colors`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Table */}
      <table className={styles.tableContainerSurvei}>
        <thead>
          <tr>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[10%]">No</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[35%]">Judul Survei</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[35%]">Nama Klien</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[20%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSurvei.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-500">
                {searchTerm ? "Tidak ada survei yang ditemukan" : "Belum ada survei yang ditambahkan"}
              </td>
            </tr>
          ) : (
            filteredSurvei.map((element, index) => (
              <tr key={element.id} className="outline-[1px] outline outline-[#bbc7cd] rounded-[28px] bg-white">
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{(page - 1) * 10 + index + 1}</td>
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{element.nama_survei}</td>
                <td className="p-4 text-center text-sm text-[#1c1c1c]">{element.nama_klien}</td>
                <td className="p-4">
                  <div className="flex justify-center space-x-1">
                    <button onClick={() => handleDetail(element.id)} className={styles.buttonSurvei} title="View Details">
                      <EyeIcon className={styles.iconSurvei} />
                    </button>
                    <button onClick={() => handleUpdate(element.id)} className={styles.buttonSurvei} title="Edit">
                      <PencilIcon className={styles.iconSurvei} />
                    </button>
                    <button onClick={() => handleDelete(element.id)} className={styles.buttonSurvei} title="Delete">
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
      <div className="mt-6 flex justify-end items-center space-x-8 px-8">
        <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} className={`flex items-center space-x-1 ${page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-gray-500"}`}>
          <span>&lt;</span>
          <span>Sebelumnya</span>
        </button>

        <button onClick={() => filteredSurvei.length > 0 && setPage(page + 1)} disabled={filteredSurvei.length === 0} className={`flex items-center space-x-1 ${filteredSurvei.length === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-gray-500"}`}>
          <span>Selanjutnya</span>
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
}
