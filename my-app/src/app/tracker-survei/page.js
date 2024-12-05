"use client";
import React, { useState, useEffect } from "react";
import { Eye, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const router = useRouter();

  const fetchSurveys = async (page = 1, search = "") => {
    const token = localStorage.getItem("authToken");
    setLoading(true);

    try {
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}survei-status/?page=${page}&page_size=${pageSize}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Token ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSurveys(data.results || []);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
      setTotalItems(data.count);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchSurveys();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchSurveys(newPage, searchQuery);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchSurveys(1, searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (loading && !surveys.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`${caudex.className} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#B31312]">Daftar Survei</h1>
          <p className="text-gray-600 mt-2">
            Total {totalItems} survei {searchQuery && "ditemukan"}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari berdasarkan nama survei atau nama perusahaan..."
          className={`w-full pl-14 pr-6 py-3 rounded-full border-2 border-gray-200 outline-none bg-transparent text-gray-600 text-sm ${caudex.className} focus:border-[#B31312] transition-colors`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-4 px-8 py-3 text-xs text-gray-500 uppercase font-medium bg-gray-50 rounded-t-lg">
        <div>Nama Survei</div>
        <div>Nama Perusahaan</div>
        <div>Action</div>
      </div>

      {/* List Rows */}
      <div className="space-y-3">
        {surveys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "Tidak ada survei yang ditemukan"
              : "Belum ada survei yang ditambahkan"}
          </div>
        ) : (
          surveys.map((survey) => (
            <div
              key={survey.id}
              className="grid grid-cols-3 gap-4 px-8 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="font-bold text-gray-700">
                {survey.nama_survei}
              </div>
              <div className="text-gray-500">{survey.nama_klien}</div>
              <div>
                <button
                  onClick={() => router.push(`/tracker-survei/${survey.id}`)}
                  className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default SurveyList;
