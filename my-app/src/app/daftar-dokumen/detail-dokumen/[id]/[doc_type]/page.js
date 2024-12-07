"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caudex } from "next/font/google";
import { toast } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Button from "components/Button"; // Importing the Button component

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

export default function DokumenDetail({ params }) {
  const { id, doc_type } = params;
  const [dokumen, setDokumen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Fetch document details
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}daftarDokumen/detailDokumen/${id}/`)
        .then((response) => response.json())
        .then((data) => setDokumen(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  const handleExport = async () => {
    console.log(`Export button clicked for `);
  
    // Set up configurations for each document type
    const config = {
      invoiceDP: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_invoice_dp/`,
        fileNameFallback: `invoiceDP_${dokumen.survey_name}.xlsx`,
        data: {
          client_name: dokumen.client_name,
          survey_name: dokumen.survey_name,
          respondent_count: dokumen.respondent_count,
          address: dokumen.address,
          amount: parseFloat(dokumen.amount).toString(),
          paid_percentage: parseFloat(dokumen.paid_percentage).toString(),
          nominal_tertulis: dokumen.nominal_tertulis,
          additional_info: dokumen.additional_info,
          date: dokumen.date,
        },
      },
      invoiceFinal: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_invoice_final/`,
        fileNameFallback: `invoiceFinal_${dokumen.survey_name}.xlsx`,
        data: {
          client_name: dokumen.client_name,
          survey_name: dokumen.survey_name,
          respondent_count: dokumen.respondent_count,
          address: dokumen.address,
          amount: parseFloat(dokumen.amount).toString(),
          paid_percentage: parseFloat(dokumen.paid_percentage).toString(),
          nominal_tertulis: dokumen.nominal_tertulis,
          additional_info: dokumen.additional_info,
          date: dokumen.date,
        },
      },
      kwitansiDP: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_kwitansi_dp/`,
        fileNameFallback: `kwitansiDP_${dokumen.survey_name}.xlsx`,
        data: {
          client_name: dokumen.client_name,
          survey_name: dokumen.survey_name,
          amount: parseFloat(dokumen.amount).toString(),
          nominal_tertulis: dokumen.nominal_tertulis,
          additional_info: dokumen.additional_info,
          date: dokumen.date,
        },
      },
      kwitansiFinal: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_kwitansi_final/`,
        fileNameFallback: `kwitansiFinal_${dokumen.survey_name}.xlsx`,
        data: {
          client_name: dokumen.client_name,
          survey_name: dokumen.survey_name,
          amount: parseFloat(dokumen.amount).toString(),
          nominal_tertulis: dokumen.nominal_tertulis,
          additional_info: dokumen.additional_info,
          date: dokumen.date,
        },
      },
    };
  
    // Select configuration based on doc_type
    const { url, fileNameFallback, data } = config[dokumen.doc_type];
  
    if (!url || !data) {
      console.error("Invalid document type specified");
      return;
    }
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Failed to export document");
      }
  
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
  
      // Use filename from server response headers or fallback
      const filename = response.headers
        .get("Content-Disposition")
        ?.split("filename=")[1] || fileNameFallback;
  
      a.download = filename.replace(/"/g, ""); // Remove quotes around filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob); // Free up memory
    } catch (error) {
      console.error("Error exporting document:", error);
    }
  };

  // Handle delete logic
  const handleDelete = async (dokumenId) => {
    const encodedId = encodeURIComponent(dokumenId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}daftarDokumen/${encodedId}/delete/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Dokumen berhasil dihapus!"); // Show success toast
        setTimeout(() => {
          router.push("/daftar-dokumen");
        }, 500);
      } else {
        toast.error("Gagal menghapus dokumen."); // Show error toast
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat menghapus dokumen."); // Show error toast
    }
  };

  if (!dokumen) return <div className="text-center">Loading...</div>;

  // Render fields based on doc_type
  const renderFields = () => {
    if (["invoiceDP", "invoiceFinal"].includes(doc_type)) {
      return (
        <>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Alamat:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.address || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Jumlah Responden:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.respondent_count || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Harga Total:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
            {new Intl.NumberFormat("id-ID").format(dokumen.amount) || "N/A"}
            </p>
          </div>
        
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Persentase Dibayar:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.paid_percentage || "N/A"}%
            </p>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Jumlah Dibayarkan:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
            {new Intl.NumberFormat("id-ID").format(dokumen.amount*dokumen.paid_percentage/100) || "N/A"}
            </p>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Jumlah Dibayarkan Tertulis:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.nominal_tertulis || "N/A"}
            </p>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Tenggat Pembayaran:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.date || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Keterangan Tambahan:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.additional_info || "N/A"}
            </p>
          </div>
        </>
      );
    } else if (["kwitansiDP", "kwitansiFinal"].includes(doc_type)) {
      return (
        <>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Jumlah Dibayarkan:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
            {new Intl.NumberFormat("id-ID").format(dokumen.amount) || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Jumlah Dibayarkan Tertulis:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.nominal_tertulis || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Tenggat Pembayaran:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.date || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
              Keterangan Tambahan:
            </label>
            <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
              {dokumen.additional_info || "N/A"}
            </p>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}>
        Detail Dokumen
      </h1>
      <div className="bg-white rounded-lg max-w-lg">
        <div className="mb-4">
          <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Kode Dokumen:
          </label>
          <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
            {dokumen.id}
          </p>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Jenis Dokumen:
          </label>
          <p className={`mt-1 text-lg text-gray-800 ${caudex.className}`}>
            {dokumen.doc_type}
          </p>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Judul:
          </label>
          <p className={`mt-1 text-lg font-bold text-gray-800 ${caudex.className}`}>
            {dokumen.survey_name}
          </p>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium text-red-700 ${caudex.className}`}>
            Nama Klien:
          </label>
          <p className={`mt-1 text-lg font-semibold text-gray-800 ${caudex.className}`}>
            {dokumen.client_name}
          </p>
        </div>
        
        {renderFields()} {/* Render dynamic fields */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="primary"
            onClick={() => router.push("/daftar-dokumen")}
            className="flex items-center px-6 py-3"
          >
            <span className={`text-sm ${caudex.className}`}>Kembali</span>
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="primary"
              onClick={(e) => handleExport(e)}
              className="flex items-center px-6 py-3"
            >
              <span className={`text-sm ${caudex.className}`}>Export</span>
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2"
            >
              <span className={`${caudex.className}`}>Delete</span>
            </Button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus dokumen &quot;{dokumen.doc_type} {dokumen.survey_name}
              &quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="modalCancel"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  handleDelete(dokumen.id);
                  setIsModalOpen(false);
                }}
                variant="modalDelete"
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

