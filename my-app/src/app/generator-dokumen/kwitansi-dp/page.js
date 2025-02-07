"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/generator-dokumen.module.css';

const KwitansiDP = () => {
  const router = useRouter();
  const [docType, setDocType] = useState('');

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log("Token missing - redirecting to login");
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_administrasi/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        const data = await response.json();
        console.log("Token verification response:", data);

        if (data.error || data.role !== 'Administrasi') {
          console.log("Invalid role or error - redirecting to login");
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to verify role:', error);
        router.push('/login');
      }
    };

    verifyUser();
  }, [router]);


  const handleExport = async () => {
    // Check if any required fields are empty
    // if (
    //   !pembayar ||
    //   !nominalPembayaran ||
    //   !tujuanPembayaran ||
    //   !amount ||
    //   !nominalTertulis ||
    //   !date
    // ) {
    //   // Display a notification or alert to the user
    //   alert("Mohon mengisi semua yang ditandai dengan * sebelum mengekspor.");
    //   return; // Stop the export process if fields are not filled
    // }
    const data = {
      pembayar,
      nominal_pembayaran: nominalPembayaran,
      tujuan_pembayaran: tujuanPembayaran,
      nominal_tertulis: nominalTertulis,
      additional_info: additionalInfo,
      amount,
      date,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}dokumen_pendukung/generate-kwitansi-dp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to export document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KwitansiDP_${tujuanPembayaran}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error exporting document:', error);
    }
  };

  

  const [pembayar, setPembayar] = useState('');
  const [nominalPembayaran, setNominalPembayaran] = useState('');
  const [tujuanPembayaran, setTujuanPembayaran] = useState('');
  const [nominalTertulis, setNominalTertulis] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleClearInputs = () => {
    setPembayar('');
    setNominalPembayaran('');
    setTujuanPembayaran('');
    setNominalTertulis('');
    setAdditionalInfo('');
    setAmount('');
    setDate('');
  };

  const handleDocTypeChange = (e) => {
    const selectedDocType = e.target.value;
    setDocType(selectedDocType);
    if (selectedDocType === 'proposal') router.push('/generator-dokumen/proposal');
    else if (selectedDocType === 'invoiceDP') router.push('/generator-dokumen/invoice-dp');
    else if (selectedDocType === 'invoiceFinal') router.push('/generator-dokumen/invoice-final');
    else if (selectedDocType === 'kontrak') router.push('/generator-dokumen/kontrak');
    else if (selectedDocType === 'kwitansiDP') router.push('/generator-dokumen/kwitansi-dp');
    else if (selectedDocType === 'kwitansiFinal') router.push('/generator-dokumen/kwitansi-final');
  };

  return (
    <div className={styles.containerbackground}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Buat Dokumen</h1>

          {/* Document Type Section */}
          <div className={styles.docType}>
            <label className={styles.label}>Jenis Dokumen</label>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="proposal"
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
                checked={docType === "invoiceFinal"}
                onChange={handleDocTypeChange}
              />
              <label htmlFor="invoiceFinal">Invoice Final</label>

              <input
                type="radio"
                id="kwitansiDP"
                name="docType"
                value="kwitansiDP"
                checked
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

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label htmlFor="pembayar">Pembayar*</label>
              <input type="text" id="pembayar" placeholder="Masukkan nama pembayar" value={pembayar} onChange={(e) => setPembayar(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="tujuanPembayaran">Tujuan Pembayaran*</label>
              <input type="text" id="tujuanPembayaran" placeholder="Masukkan tujuan pembayaran" value={tujuanPembayaran} onChange={(e) => setTujuanPembayaran(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="nominalTertulis">Nominal Tertulis*</label>
              <input type="text" id="nominalTertulis" placeholder="Masukkan nominal tertulis" value={nominalTertulis} onChange={(e) => setNominalTertulis(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="additionalInfo">Keterangan</label>
              <textarea id="additionalInfo" placeholder="Tambah keterangan" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)}></textarea>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="amount">Jumlah Pembayaran*</label>
              <input type="number" id="amount" placeholder="Masukkan jumlah" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className={styles.datePicker}>
              <label htmlFor="date">Tanggal Pembayaran*</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className={styles.buttonGroup}>
              <button type="button" className={styles.cancelButton} onClick={handleClearInputs}>Batal</button>
              <button type="button" className={styles.exportButton} onClick={handleExport}>
                <img src="/images/additem.svg" alt="Export Icon" />Export
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.footer}>
        @2024 optimasys | Contact optimasys.work@gmail.com
      </div>
    </div>
  );
};

export default KwitansiDP;