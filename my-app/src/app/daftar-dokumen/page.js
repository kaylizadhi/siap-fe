"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2 } from "lucide-react";
import styles from '../../../styles/daftar-dokumen.module.css';

export default function DaftarDokumen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const dokumenPerPage = 10;
    const [dokumen, setDokumen] = useState([]);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentDokumenIndex, setCurrentDokumenIndex] = useState(null);
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
    const [sortColumn, setSortColumn] = useState("id"); // Column to sort by
    const [docTypeFilter, setDocTypeFilter] = useState(""); // Filter by doc_type
    const [docDetail, setDocDetail] = useState(""); // Detailed data of dokumen

    // Fetch document data from backend
    useEffect(() => {
        const fetchDokumen = async () => {
            try {
                const url = searchQuery
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}daftarDokumen/searchDokumen/?q=${encodeURIComponent(searchQuery)}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}daftarDokumen/daftarDokumen/`;
                const response = await fetch(url);
                const data = await response.json();
                console.log("Fetched documents:", data);
                // Sort the documents by 'id' in descending order right after fetching
                const sortedData = data.sort((a, b) => 
                     b.id.localeCompare(a.id) // Sorting by 'id' in descending order
                );

                setDokumen(sortedData);
                // setDokumen(data);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        }
    

        const verifyUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }
            
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_proposal/`, {
                        headers: { 'Authorization': `Token ${token}` },
                    });
                    const data = await response.json();
    
                    if (data.error || data.role !== 'Administrasi' && data.role !== 'Eksekutif') {
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Failed to verify role:', error);
                    router.push('/login');
                }
        
    };
    fetchDokumen();
    verifyUser();
}, [searchQuery], [router]);     

    // const handleDeleteClick = (index) => {
    //     setCurrentDokumenIndex(index);
    //     setShowDeleteModal(true);
    // };


    const filteredDokumen = dokumen.filter(dokumen => {
        const matchesSearch = dokumen.survey_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dokumen.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dokumen.doc_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dokumen.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDocType = docTypeFilter ? dokumen.doc_type.toLowerCase() === docTypeFilter.toLowerCase() : true;

        return matchesSearch && matchesDocType;
    });


    const handleSort = (column) => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortOrder(newSortOrder);

        const sortedDokumen = [...dokumen].sort((a, b) => {
            let aValue; let 
bValue;

            if (column === "id") {
                // Extract the numeric part of the ID
                aValue = parseInt(a.id.slice(0, 3));
                bValue = parseInt(b.id.slice(0, 3));
            } else {
                aValue = a[column].toLowerCase();
                bValue = b[column].toLowerCase();
            }

            if (aValue < bValue) return newSortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return newSortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setDokumen(sortedDokumen);
    };


    const indexOfLastDokumen = currentPage * dokumenPerPage;
    const indexOfFirstDokumen = indexOfLastDokumen - dokumenPerPage;
    const currentDokumen = filteredDokumen.slice(indexOfFirstDokumen, indexOfLastDokumen);

    const totalPages = Math.ceil(filteredDokumen.length / dokumenPerPage);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDetail = (id, doc_type) => {
        const encodedId = encodeURIComponent(id);
        router.push(`/daftar-dokumen/detail-dokumen/${encodedId}/${doc_type}`);
      };

    // const handleDelete = async (index, dokumenId) => {
    //     const dokumenIndex = index + indexOfFirstDokumen;
    //     const encodedId = encodeURIComponent(dokumenId);
    //     setDeletingIndex(dokumenIndex);
    //     try {
    //         await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}daftarDokumen/${encodedId}/delete/`, {
    //             method: 'DELETE',
                
    //         });
    //         setShowDeleteModal(false);
    //         console.log("dokumen deleted");
    //         const updatedDokumen = dokumen.filter((_, i) => i !== dokumenIndex);
    //         setDokumen(updatedDokumen);
    //     } catch (error) {
    //         console.error("Error deleting dokumen:", error);
    //     } finally {
    //         setDeletingIndex(null);
    //     }
    // };

    const handleExport = async (e, dokumenId, doc_type) => {
        e.preventDefault();
        console.log(`Export button clicked for `);

        const encodedId = encodeURIComponent(dokumenId);
        if (dokumenId) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}daftarDokumen/detailDokumen/${encodedId}/`)
              .then((response) => response.json())
              .then((data) => setDocDetail(data))
              .catch((error) => console.error("Error:", error));
          }
      
        // Set up configurations for each document type
        const config = {
          invoiceDP: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_invoice_dp/`,
            fileNameFallback: `invoiceDP_${docDetail.survey_name}.xlsx`,
            data: {
              client_name: docDetail.client_name,
              survey_name: docDetail.survey_name,
              respondent_count: docDetail.respondent_count,
              address: docDetail.address,
              amount: parseFloat(docDetail.amount).toString(),
              paid_percentage: parseFloat(docDetail.paid_percentage).toString(),
              nominal_tertulis: docDetail.nominal_tertulis,
              additional_info: docDetail.additional_info,
              date: docDetail.date,
            },
          },
          invoiceFinal: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_invoice_final/`,
            fileNameFallback: `invoiceFinal_${dokumen.survey_name}.xlsx`,
            data: {
                client_name: docDetail.client_name,
                survey_name: docDetail.survey_name,
                respondent_count: docDetail.respondent_count,
                address: docDetail.address,
                amount: parseFloat(docDetail.amount).toString(),
                paid_percentage: parseFloat(docDetail.paid_percentage).toString(),
                nominal_tertulis: docDetail.nominal_tertulis,
                additional_info: docDetail.additional_info,
                date: docDetail.date,
            },
          },
          kwitansiDP: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_kwitansi_dp/`,
            fileNameFallback: `kwitansiDP_${dokumen.survey_name}.xlsx`,
            data: {
              client_name: docDetail.client_name,
              survey_name: docDetail.survey_name,
              amount: parseFloat(docDetail.amount).toString(),
              nominal_tertulis: docDetail.nominal_tertulis,
              additional_info: docDetail.additional_info,
              date: docDetail.date,
            },
          },
          kwitansiFinal: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/export_existing_kwitansi_final/`,
            fileNameFallback: `kwitansiFinal_${dokumen.survey_name}.xlsx`,
            data: {
                client_name: docDetail.client_name,
                survey_name: docDetail.survey_name,
                amount: parseFloat(docDetail.amount).toString(),
                nominal_tertulis: docDetail.nominal_tertulis,
                additional_info: docDetail.additional_info,
                date: docDetail.date,
            },
          },
        };
        // Select configuration based on doc_type
    const { url, fileNameFallback, data } = config[doc_type];
  
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


    return (
        <div className={styles.mainContainer}>
            {/* Main Document List Content */}
            <div className={styles.container}>
                <h1 className={`text-4xl font-weight-700 text-primary-900`}>Daftar Dokumen Pendukung</h1>

                <div className="w-full flex px-6 py-3 mb-6 rounded-full border-2 border overflow-hidden mx-auto">
                    <input
                        type="text"
                        placeholder="Cari dokumen..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className={'w-full outline-none bg-transparent text-gray-600 text-sm'}
                    />
                </div>

                {/* Filter by Doc Type */}
                <div className={styles.filterContainer}>
                    <select
                        value={docTypeFilter}
                        onChange={(e) => setDocTypeFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Filter Jenis Dokumen</option>
                        <option value="invoiceDP">Invoice DP</option>
                        <option value="invoiceFinal">Invoice Final</option>
                        <option value="kwitansiDP">Kwitansi DP</option>
                        <option value="kwitansiFinal">Kwitansi Final</option>
                    </select>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr className={styles.header}>
                            <th onClick={() => handleSort("id")}>
                                Kode {sortColumn === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th>Judul</th>
                            <th>Klien</th>
                            <th>Jenis Dokumen</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDokumen.map((dokumen) => (
                            <tr
                                key={dokumen.id}
                                // className={index + indexOfFirstDokumen === deletingIndex ? styles.fadeOut : ""}
                            >
                                <td>{dokumen.id}</td>
                                <td>{dokumen.survey_name}</td>
                                <td>{dokumen.client_name}</td>
                                <td>{dokumen.doc_type}</td>
                                <td className={styles.actions}>
                                    <button
                                        onClick={() => handleDetail(dokumen.id, dokumen.doc_type)}
                                        className="text-gray-800 hover:text-gray-600 transition-colors"
                                    >
                                        <img src="/images/eye-icon.png" alt="Details"/>
                                    </button>
                                    <button 
                                        className="text-red-800 hover:text-gray-600 transition-colors" 
                                        onClick={(e) => handleExport(e, dokumen.id, dokumen.doc_type)}
                                    >
                                        <img src="/images/Create.svg" alt="Create" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    {currentPage > 1 && (
                        <button onClick={() => setCurrentPage(currentPage - 1)}>
                            &lt; Kembali
                        </button>
                    )}
                    {currentPage < totalPages && (
                        <button onClick={() => setCurrentPage(currentPage + 1)}>
                            Selanjutnya &gt;
                        </button>
                        
                    )}
                </div>
            </div>
            {/* {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p>Apakah Anda yakin ingin menghapus dokumen ini?</p>
                        <button onClick={() => handleDelete(currentDokumenIndex, dokumen[currentDokumenIndex].id)} className={styles.confirmButton}>Ya</button>
                        <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>Tidak</button>
                    </div>
                </div>
            )} */}
        </div>
    );
}
