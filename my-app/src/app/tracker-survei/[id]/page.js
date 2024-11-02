"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Caudex } from "next/font/google";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

const StatusBox = ({ status, onStatusChange, fieldKey, label, isLoading }) => {
  const statusColors = {
    NOT_STARTED: "bg-gray-200",
    IN_PROGRESS: "bg-yellow-200",
    FINISHED: "bg-green-200",
    DELAYED: "bg-red-200",
  };

  return (
    <div className="w-full text-xs mb-2">
      <div className="text-xs font-medium mb-1">{label}</div>
      <div
        className={`border rounded-md p-2 ${statusColors[status]} ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <select
          value={status}
          onChange={(e) => onStatusChange(fieldKey, e.target.value)}
          disabled={isLoading}
          className="w-full bg-transparent border-none focus:ring-0 cursor-pointer text-xs"
        >
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="FINISHED">Finished</option>
          <option value="DELAYED">Delayed</option>
        </select>
      </div>
    </div>
  );
};

export default function SurveyTrackerDetail({ params }) {
  const { id } = params;
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingField, setUpdatingField] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  const fetchSurveyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/survey-status/${id}/`
      );
      if (!response.ok) throw new Error("Failed to fetch survey data");
      const data = await response.json();

      const statusObject = data.status.reduce((acc, curr) => {
        const [key, value] = Object.entries(curr)[0];
        acc[key] = value;
        return acc;
      }, {});

      setSurveyData({
        ...data,
        status: statusObject,
      });
    } catch (error) {
      toast.error("Failed to load survey data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (field, newStatus) => {
    setUpdatingField(field);
    try {
      const response = await fetch(
        `http://localhost:8000/survey-status/${id}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: newStatus }),
        }
      );

      if (!response.ok) {
        // Extract error text from the raw response
        const errorText = await response.text();

        // Find the error message inside the string using regex
        const errorMessageMatch = errorText.match(/'__all__': \['(.+?)'\]/);
        const errorMessage = errorMessageMatch
          ? errorMessageMatch[1]
          : "Failed to update status";

        throw new Error(errorMessage);
      }

      // Update status in the local state
      setSurveyData((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          [field]: newStatus,
        },
      }));

      toast.success("Status updated successfully");
    } catch (error) {
      // Display the manipulated error message or fallback message
      toast.error(
        error.message || "Failed to update status. Please try again."
      );
      fetchSurveyData(); // Revert the state if update fails
    } finally {
      setUpdatingField(null);
    }
  };

  if (loading || !surveyData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h2
          className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}
        >
          Tracker Status
        </h2>
        <div className={`mt-2 text-lg ${caudex.className}`}>
          {surveyData.nama_survei}
        </div>
        <div className={`text-gray-600 ${caudex.className}`}>
          {surveyData.nama_klien}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Administrasi Column */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Administrasi</h3>
          <StatusBox
            label="Buat Kontrak"
            status={surveyData.status.buat_kontrak}
            onStatusChange={handleStatusChange}
            fieldKey="buat_kontrak"
            isLoading={updatingField === "buat_kontrak"}
          />
          <StatusBox
            label="Buat Invoice"
            status={surveyData.status.buat_invoice}
            onStatusChange={handleStatusChange}
            fieldKey="buat_invoice"
            isLoading={updatingField === "buat_invoice"}
          />
          <StatusBox
            label="Pembayaran Lunas"
            status={surveyData.status.pembayaran_lunas}
            onStatusChange={handleStatusChange}
            fieldKey="pembayaran_lunas"
            isLoading={updatingField === "pembayaran_lunas"}
          />
          <StatusBox
            label="Pembuatan Kwitansi"
            status={surveyData.status.pembuatan_kwitansi}
            onStatusChange={handleStatusChange}
            fieldKey="pembuatan_kwitansi"
            isLoading={updatingField === "pembuatan_kwitansi"}
          />
        </div>

        {/* Logistik Column */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Logistik</h3>
          <StatusBox
            label="Menerima request souvenir"
            status={surveyData.status.terima_request_souvenir}
            onStatusChange={handleStatusChange}
            fieldKey="terima_request_souvenir"
            isLoading={updatingField === "terima_request_souvenir"}
          />
          <StatusBox
            label="Mengambil souvenir"
            status={surveyData.status.ambil_souvenir}
            onStatusChange={handleStatusChange}
            fieldKey="ambil_souvenir"
            isLoading={updatingField === "ambil_souvenir"}
          />
        </div>

        {/* Pengendali Mutu Column */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Pengendali Mutu</h3>
          <StatusBox
            label="Menerima informasi survei"
            status={surveyData.status.terima_info_survei}
            onStatusChange={handleStatusChange}
            fieldKey="terima_info_survei"
            isLoading={updatingField === "terima_info_survei"}
          />
          <StatusBox
            label="Melakukan survei"
            status={surveyData.status.lakukan_survei}
            onStatusChange={handleStatusChange}
            fieldKey="lakukan_survei"
            isLoading={updatingField === "lakukan_survei"}
          />
          <StatusBox
            label="Memantau responden yang sedang mengisi survei"
            status={surveyData.status.pantau_responden}
            onStatusChange={handleStatusChange}
            fieldKey="pantau_responden"
            isLoading={updatingField === "pantau_responden"}
          />
          <StatusBox
            label="Memantau banyaknya data yang dilakukan data cleaning"
            status={surveyData.status.pantau_data_cleaning}
            onStatusChange={handleStatusChange}
            fieldKey="pantau_data_cleaning"
            isLoading={updatingField === "pantau_data_cleaning"}
          />
        </div>
      </div>
    </div>
  );
}
