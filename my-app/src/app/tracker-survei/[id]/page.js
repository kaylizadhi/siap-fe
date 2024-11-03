"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Caudex } from "next/font/google";
import { useRouter } from "next/navigation";
import StatusBox from "components/StatusBox";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function SurveyTrackerDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingField, setUpdatingField] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Check role for Administrasi
        const adminResponse = await fetch(
          "http://localhost:8000/accounts/check_role_administrasi/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        if (adminResponse.ok) {
          const data = await adminResponse.json();
          setUserRole("Administrasi");
          return;
        }

        // If not Administrasi, check for Logistik
        const logistikResponse = await fetch(
          "http://localhost:8000/accounts/check_role_logistik/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        if (logistikResponse.ok) {
          const data = await logistikResponse.json();
          setUserRole("Logistik");
          return;
        }

        // If not Logistik, check for Pengendali Mutu
        const mutuResponse = await fetch(
          "http://localhost:8000/accounts/check_role_pengendalimutu/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        if (mutuResponse.ok) {
          const data = await mutuResponse.json();
          setUserRole("Pengendali Mutu");
          return;
        }

        // If none of the roles match, redirect to login
        router.push("/login");
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    verifyUser();
    if (id) {
      fetchSurveyData();
    }
  }, [id, router]);

  const fetchSurveyData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `http://localhost:8000/survei-status/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
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
    const token = localStorage.getItem("authToken");
    setUpdatingField(field);

    // Determine which endpoint to use based on the field and user role
    let endpoint;
    if (userRole === "Administrasi") {
      endpoint = `http://localhost:8000/survei-status/${id}/administrasi/`;
    } else if (userRole === "Logistik") {
      endpoint = `http://localhost:8000/survei-status/${id}/logistik/`;
    } else if (userRole === "Pengendali Mutu") {
      endpoint = `http://localhost:8000/survei-status/${id}/pengendali-mutu/`;
    } else {
      toast.error("Unauthorized to make changes");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ [field]: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle the specific error format {"__all__": ["error message"]}
        const errorMessage =
          errorData.__all__?.[0] || "Failed to update status";
        throw new Error(errorMessage);
      }

      setSurveyData((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          [field]: newStatus,
        },
      }));

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(
        error.message || "Failed to update status. Please try again."
      );
      fetchSurveyData();
    } finally {
      setUpdatingField(null);
    }
  };

  const isFieldEditable = (fieldCategory) => {
    const roleMapping = {
      Administrasi: [
        "buat_kontrak",
        "buat_invoice",
        "pembayaran_lunas",
        "pembuatan_kwitansi",
      ],
      Logistik: ["terima_request_souvenir", "ambil_souvenir"],
      "Pengendali Mutu": [
        "terima_info_survei",
        "lakukan_survei",
        "pantau_responden",
        "pantau_data_cleaning",
      ],
    };

    return roleMapping[userRole]?.includes(fieldCategory) || false;
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
            isEditable={isFieldEditable("buat_kontrak")}
          />
          <StatusBox
            label="Buat Invoice"
            status={surveyData.status.buat_invoice}
            onStatusChange={handleStatusChange}
            fieldKey="buat_invoice"
            isLoading={updatingField === "buat_invoice"}
            isEditable={isFieldEditable("buat_invoice")}
          />
          <StatusBox
            label="Pembayaran Lunas"
            status={surveyData.status.pembayaran_lunas}
            onStatusChange={handleStatusChange}
            fieldKey="pembayaran_lunas"
            isLoading={updatingField === "pembayaran_lunas"}
            isEditable={isFieldEditable("pembayaran_lunas")}
          />
          <StatusBox
            label="Pembuatan Kwitansi"
            status={surveyData.status.pembuatan_kwitansi}
            onStatusChange={handleStatusChange}
            fieldKey="pembuatan_kwitansi"
            isLoading={updatingField === "pembuatan_kwitansi"}
            isEditable={isFieldEditable("pembuatan_kwitansi")}
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
            isEditable={isFieldEditable("terima_request_souvenir")}
          />
          <StatusBox
            label="Mengambil souvenir"
            status={surveyData.status.ambil_souvenir}
            onStatusChange={handleStatusChange}
            fieldKey="ambil_souvenir"
            isLoading={updatingField === "ambil_souvenir"}
            isEditable={isFieldEditable("ambil_souvenir")}
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
            isEditable={isFieldEditable("terima_info_survei")}
          />
          <StatusBox
            label="Melakukan survei"
            status={surveyData.status.lakukan_survei}
            onStatusChange={handleStatusChange}
            fieldKey="lakukan_survei"
            isLoading={updatingField === "lakukan_survei"}
            isEditable={isFieldEditable("lakukan_survei")}
          />
          <StatusBox
            label="Memantau responden yang sedang mengisi survei"
            status={surveyData.status.pantau_responden}
            onStatusChange={handleStatusChange}
            fieldKey="pantau_responden"
            isLoading={updatingField === "pantau_responden"}
            isEditable={isFieldEditable("pantau_responden")}
          />
          <StatusBox
            label="Memantau banyaknya data yang dilakukan data cleaning"
            status={surveyData.status.pantau_data_cleaning}
            onStatusChange={handleStatusChange}
            fieldKey="pantau_data_cleaning"
            isLoading={updatingField === "pantau_data_cleaning"}
            isEditable={isFieldEditable("pantau_data_cleaning")}
          />
        </div>
      </div>
    </div>
  );
}
