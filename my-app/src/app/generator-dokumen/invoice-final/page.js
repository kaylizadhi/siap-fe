"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/generator-dokumen.module.css";

const InvoiceFinal = () => {
  const router = useRouter();
  const [docType, setDocType] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_administrasi/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data = await response.json();

        if (data.error || data.role !== "Administrasi") {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    verifyUser();
  }, [router]);

  const handleExport = async () => {
    // Check if any required fields are empty
    if (
      !clientName ||
      !surveyName ||
      !respondentCount ||
      !address ||
      !amount ||
      !paidPercentage ||
      !nominalTertulis ||
      !date
    ) {
      // Display a notification or alert to the user
      alert("Mohon mengisi semua yang ditandai dengan * sebelum mengekspor.");
      return; // Stop the export process if fields are not filled
    }
    console.log("Export button clicked");
    const data = {
      client_name: clientName,
      survey_name: surveyName,
      respondent_count: respondentCount,
      address: address,
      amount: amount,
      paid_percentage: paidPercentage,
      nominal_tertulis: nominalTertulis,
      additional_info: additionalInfo,
      date: date,
    };
    console.log("Data to send:", data);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/generate_invoice_final/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error("Failed to export document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoiceFinal_${surveyName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting document:", error);
    }
  };

  // State for form inputs
  const [clientName, setClientName] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [respondentCount, setRespondentCount] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [paidPercentage, setPaidPercentage] = useState("");
  const [nominalTertulis, setNominalTertulis] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [date, setDate] = useState("");

  const handleClearInputs = () => {
    setClientName("");
    setSurveyName("");
    setRespondentCount("");
    setAddress("");
    setAmount("");
    setPaidPercentage("");
    setNominalTertulis("");
    setAdditionalInfo("");
    setDate("");
  };

  const handleDocTypeChange = (e) => {
    const selectedDocType = e.target.value;
    setDocType(selectedDocType);

    if (selectedDocType === "proposal") {
      router.push("/generator-dokumen/proposal");
    }
    if (selectedDocType === "invoiceDP") {
      router.push("/generator-dokumen/invoice-dp");
    }
    if (selectedDocType === "kontrak") {
      router.push("/generator-dokumen/kontrak");
    }
    if (selectedDocType === "kwitansiDP") {
      router.push("/generator-dokumen/kwitansi-dp");
    }
    if (selectedDocType === "kwitansiFinal") {
      router.push("/generator-dokumen/kwitansi-final");
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Buat Dokumen</h1>

      {/* Document Type Section */}
      <div className={styles.docType}>
        <label className={styles.label}>Jenis Dokumen</label>
        <div className={styles.radioGroup}>
          <input
            type="radio"
            id="Proposal"
            name="docType"
            value="proposal"
            checked={docType === "proposal"}
            onChange={handleDocTypeChange}
          />
          <label htmlFor="proposal">Proposal</label>
          <input
            type="radio"
            id="kontrak"
            name="docType"
            value="kontrak"
            checked={docType === "kontrak"}
            onChange={handleDocTypeChange}
          />
          <label htmlFor="kontrak">Kontrak</label>
          <input
            type="radio"
            id="invoiceDP"
            name="docType"
            value="invoiceDP"
            checked={docType === "invoiceDP"}
            onChange={handleDocTypeChange}
          />
          <label htmlFor="invoiceDP">Invoice DP</label>
          <input
            type="radio"
            id="invoiceFinal"
            name="docType"
            value="invoiceFinal"
            checked
            onChange={handleDocTypeChange}
          />
          <label htmlFor="invoiceFinal">Invoice Final</label>
          <input
            type="radio"
            id="kwitansiDP"
            name="docType"
            value="kwitansiDP"
            checked={docType === "kwitansiDP"}
            onChange={handleDocTypeChange}
          />
          <label htmlFor="kwitansiDP">Kwitansi DP</label>
          <input
            type="radio"
            id="kwitansiFinal"
            name="docType"
            value="kwitansiFinal"
            checked={docType === "kwitansiFinal"}
            onChange={handleDocTypeChange}
          />
          <label htmlFor="kwitansiFinal">Kwitansi Final</label>
        </div>
      </div>

      {/* Form Inputs */}
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="clientName">Nama Klien*</label>
          <input
            type="text"
            id="clientName"
            placeholder="Masukkan nama klien"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="surveyName">Nama Survei*</label>
          <input
            type="text"
            id="surveyName"
            placeholder="Masukkan nama survei"
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="respondentCount">Jumlah Responden*</label>
          <input
            type="number"
            id="respondentCount"
            placeholder="Masukkan jumlah Responden"
            value={respondentCount}
            onChange={(e) => setRespondentCount(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Alamat*</label>
          <input
            type="text"
            id="address"
            placeholder="Masukkan alamat"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.nominalContainer}>
            <label htmlFor="amount">Harga Total*</label>
            <div className={styles.nominalInput}>
              <span>Rp</span>
              <input
                type="number"
                id="amount"
                placeholder="Masukkan nominal harga"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.percentageContainer}>
            <label htmlFor="paidPercentage">Persentase Pembayaran*</label>
            <div className={styles.percentageInput}>
              <input
                type="number"
                id="paidPercentage"
                placeholder="%"
                value={paidPercentage}
                onChange={(e) => setPaidPercentage(e.target.value)}
              />
              <span>%</span>
            </div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="nominalTertulis">Jumlah Pembayaran Tertulis*</label>
          <input
            type="text"
            id="nominalTertulis"
            placeholder="Masukkan nominal tertulis"
            value={nominalTertulis}
            onChange={(e) => setNominalTertulis(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="additionalInfo">Keterangan</label>
          <textarea
            id="additionalInfo"
            placeholder="Tambah keterangan"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.datePicker}>
          <label>Tanggal Pembayaran*</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClearInputs}
          >
            Batal
          </button>
          <button
            type="button"
            className={styles.exportButton}
            onClick={handleExport}
          >
            <img src="/images/additem.svg" alt="Export Icon" />
            Export
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceFinal;
