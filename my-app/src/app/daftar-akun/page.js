"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const caudex = Caudex({
  weight: "700",
  subsets: ["latin"],
});

const styles = {
  tableContainerSurvei: "w-full text-center font-[Caudex] border-collapse border-spacing-0 border-separate border-spacing-y-2",
  buttonSurvei: "border-none bg-none cursor-pointer",
  iconSurvei: "mt-1 w-8 h-8 cursor-pointer px-2 rounded-[20px] py-2 text-red-600 hover:bg-red-100",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const url = searchQuery ? `${process.env.NEXT_PUBLIC_BASE_URL}daftarAkun/api/searchAkun/?q=${encodeURIComponent(searchQuery)}` : `${process.env.NEXT_PUBLIC_BASE_URL}daftarAkun/api/daftarAkun/`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data = await response.json();
        setAccounts(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / accountsPerPage));
        setError(null);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError("Failed to load accounts");
        toast.error("Failed to load accounts", {
          position: "bottom-right",
          theme: "light",
        });
      } finally {
        setLoading(false);
      }
    };

    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_admin/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to verify role");
        }

        const data = await response.json();

        if (data.error || data.role !== "Admin Sistem") {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    verifyUser();
    fetchAccounts();
  }, [searchQuery, router]);

  const handleDeleteClick = (index) => {
    setCurrentAccountIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = async (index, accountId) => {
    const accountIndex = index + indexOfFirstAccount;
    setDeletingIndex(accountIndex);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}daftarAkun/${accountId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.statusText}`);
      }

      setShowDeleteModal(false);

      // Update accounts list
      setAccounts((prevAccounts) => {
        const newAccounts = prevAccounts.filter((_, i) => i !== accountIndex);
        setTotalItems(newAccounts.length);
        setTotalPages(Math.ceil(newAccounts.length / accountsPerPage));
        return newAccounts;
      });

      // Show success toast
      toast.success("Akun berhasil dihapus", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Gagal menghapus akun", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setDeletingIndex(null);
    }
  };

  const filteredAccounts = accounts.filter((account) => account.username.toLowerCase().includes(searchQuery.toLowerCase()) || `${account.first_name} ${account.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()));

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

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
      <div className="overflow-x-auto">
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
                    <button onClick={() => handleDeleteClick(index)} className={styles.buttonSurvei} title="Delete" disabled={deletingIndex !== null}>
                      <TrashIcon className={styles.iconSurvei} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <button
                onClick={() => {
                  const account = accounts[currentAccountIndex];
                  if (account) {
                    handleDelete(currentAccountIndex, account.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
