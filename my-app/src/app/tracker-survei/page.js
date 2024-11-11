"use client";
import React, { useState, useEffect } from "react";
import { Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}survei/get-list-survei`,
        {
          headers: {
            Authorization: token ? `Token ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSurveys(data.results || []);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter(
    (survey) =>
      survey?.nama_survei?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey?.nama_klien?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
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
        <h1 className="text-3xl font-bold text-[#B31312]">Daftar Survei</h1>
      </div>

      {/* Search Input */}
      <div className="w-full flex px-6 py-3 mb-6 rounded-full border-2 border-gray-300 overflow-hidden">
        <input
          type="text"
          placeholder="Cari survei..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full outline-none bg-transparent text-gray-600 text-sm"
        />
      </div>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-4 px-8 py-3 text-xs text-gray-500 uppercase font-medium">
        <div>Nama Survei</div>
        <div>Nama Perusahaan</div>
        <div>Action</div>
      </div>

      {/* List Rows */}
      <div className="space-y-3">
        {filteredSurveys.map((survey) => (
          <div
            key={survey.id}
            className="grid grid-cols-3 gap-4 px-8 py-3 bg-white rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="font-bold text-gray-700">{survey.nama_survei}</div>
            <div className="text-gray-500">{survey.nama_klien}</div>
            <div>
              <button
                onClick={() => router.push(`/tracker-survei/${survey.id}`)}
                className="text-gray-800 hover:text-gray-600 transition-colors"
                title="View"
              >
                <Eye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? "No matching surveys found" : "No surveys available"}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
