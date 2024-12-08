"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const caudex = Caudex({
  weight: "700",
  subsets: ["latin"],
});

const styles = {
  tableContainerSurvei: "w-full text-center font-[Caudex] border-collapse border-spacing-0 border-separate border-spacing-y-2",
  buttonSurvei: "border-none bg-none cursor-pointer",
  iconSurvei: "mt-1 w-8 h-8 cursor-pointer px-2 rounded-[20px] py-2",
};

export default function DaftarAkun() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;
  const [accounts, setAccounts] = useState([]);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch account data from backend
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const url = searchQuery ? `http://localhost:8000/daftarAkun/api/searchAkun/?q=${encodeURIComponent(searchQuery)}` : "http://localhost:8000/daftarAkun/api/daftarAkun/";
        const response = await fetch(url);
        const data = await response.json();
        setAccounts(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / accountsPerPage));
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/accounts/check_role_admin/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();

        if (data.error || data.role !== "Admin Sistem") {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    fetchAccounts();
    verifyUser();
  }, [searchQuery, router]);

  const handleDeleteClick = (index) => {
    setCurrentAccountIndex(index);
    setShowDeleteModal(true);
  };

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter((account) => account.username.toLowerCase().includes(searchQuery.toLowerCase()) || `${account.first_name} ${account.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()));

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (index, accountId) => {
    const accountIndex = index + indexOfFirstAccount;
    setDeletingIndex(accountIndex);
    try {
      await fetch(`http://localhost:8000/daftarAkun/${accountId}/delete/`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      const updatedAccounts = accounts.filter((_, i) => i !== accountIndex);
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className={`${caudex.className} p-6`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary-900">Daftar Akun</h1>
          <p className="text-gray-600 mt-2">
            Total {totalItems} akun {searchQuery && "ditemukan"}
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input type="text" placeholder="Cari berdasarkan username atau nama..." value={searchQuery} onChange={handleSearch} className={`w-full pl-14 pr-6 py-3 rounded-full border-2 border-gray-200 outline-none bg-transparent text-gray-600 text-sm ${caudex.className} focus:border-primary-900 transition-colors`} />
      </div>

      {/* Table */}
      <table className={styles.tableContainerSurvei}>
        <thead>
          <tr>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[10%]">No</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[20%]">Username</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[25%]">Nama</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[25%]">Email</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[15%]">Role</th>
            <th className="text-center text-sm font-bold text-[#1c1c1c] p-4 w-[5%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account, index) => (
            <tr key={account.id} className={`outline-[1px] outline outline-[#bbc7cd] rounded-[28px] bg-white ${index + indexOfFirstAccount === deletingIndex ? "opacity-50" : ""}`}>
              <td className="p-4 text-center text-sm text-[#1c1c1c]">{indexOfFirstAccount + index + 1}</td>
              <td className="p-4 text-center text-sm text-[#1c1c1c]">{account.username}</td>
              <td className="p-4 text-center text-sm text-[#1c1c1c]">{`${account.first_name} ${account.last_name}`}</td>
              <td className="p-4 text-center text-sm text-[#1c1c1c]">{account.email}</td>
              <td className="p-4 text-center text-sm text-[#1c1c1c]">{account.role}</td>
              <td className="p-4">
                <div className="flex justify-center">
                  <button onClick={() => handleDeleteClick(index)} className={styles.buttonSurvei} title="Delete">
                    <TrashIcon className={styles.iconSurvei} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-end items-center space-x-8 px-8">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`flex items-center space-x-1 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-gray-500"}`}>
            <span>&lt;</span>
            <span>Sebelumnya</span>
          </button>

          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`flex items-center space-x-1 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-gray-500"}`}>
            <span>Selanjutnya</span>
            <span>&gt;</span>
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6 text-gray-600">Apakah Anda yakin ingin menghapus akun ini?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Batal
              </button>
              <button onClick={() => handleDelete(currentAccountIndex, accounts[currentAccountIndex].id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
