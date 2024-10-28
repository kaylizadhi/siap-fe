"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/generator-dokumen.module.css'; 



const Proposal = () => {
  const router = useRouter();
  const [docType, setDocType] = useState(''); // State to track selected document type
  const [slideImage, setSlideImage] = useState(null); // State to hold the image URL

  useEffect(() => {
    const verifyUser = async () => {
        const token = localStorage.getItem('authToken');  
        if (!token) {
            router.push('/login');  
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/accounts/check_role_proposal/', {
                headers: { 'Authorization': `Token ${token}` },
            });
            const data = await response.json();

            if (data.error || data.role !== 'Administrasi' && data.role !== 'Eksekutif') {
                router.push('/login');  // Redirect if not "Administrasi" or "Eksekutif"
            }
        } catch (error) {
            console.error('Failed to verify role:', error);
            router.push('/login');
        }
    };

    const fetchSlideImage = async () => {
        const response = await fetch('http://localhost:8000/dokumen_pendukung/convert_pptx_to_image/');
        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setSlideImage(imageUrl);
        } else {
            console.error("Failed to load slide image.");
        }
    };

    verifyUser();
    fetchSlideImage();
}, [router]);
  

  const handleExport = async () => {
    try {
        const response = await fetch('http://localhost:8000/dokumen_pendukung/download_template_proposal/', {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error('Failed to download the template');
        }
  
        // Convert the response to a Blob and trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'templateProposal.ppt'; // Specify the filename
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        console.error('Error downloading template:', error);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove the token
    router.push('/login');
  };

  
    

  const handleDocTypeChange = (e) => {
    const selectedDocType = e.target.value;
    setDocType(selectedDocType);

    // Redirect based on selected document type
    if (selectedDocType === 'invoiceDP') {
      router.push('/generator-dokumen/invoice-dp');
    }
    if (selectedDocType === 'invoiceFinal') {
        router.push('/generator-dokumen/invoice-final');
    }
    if (selectedDocType === 'kontrak') {
        router.push('/generator-dokumen/kontrak');
    }
    if (selectedDocType === 'kwitansiDP') {
        router.push('/generator-dokumen/kwitansi-dp');
    }
    if (selectedDocType === 'kwitansiFinal') {
        router.push('/generator-dokumen/kwitansi-final');
    }
  };


  return (
    <div className={styles.containerbackground}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <img src="/images/siap-logo-2.svg" alt="siap-logo-2" />
          </div>
          <nav className={styles.nav}>
            <a href="/dashboard">
              <img src="/images/Home.svg" alt="Dashboard Icon" className={styles.icon} />Dashboard
            </a>
            <a href="/profil">
              <img src="/images/Profile.svg" alt="Profile Icon" className={styles.active} />Profil
            </a>
            <a href="/create-account">
              <img src="/images/Add.svg" alt="Create Icon" className={styles.icon} />Buat Akun
            </a>
            <a href="/generator-dokumen/invoice-final" className={styles.active}>
              <img src="/images/CreateRed.svg" alt="Buat Dokumen Icon" className={styles.icon} />Buat Dokumen
            </a>
            <a href="/documents">
              <img src="/images/Document.svg" alt="Daftar Dokumen Icon" className={styles.icon} />Daftar Dokumen
            </a>
            <a href="/souvenir-tracker">
              <img src="/images/Inventory.svg" alt="Tracker Souvenir Icon" className={styles.icon} />Tracker Souvenir
            </a>
            <a href="/survey-tracker">
              <img src="/images/Status.svg" alt="Tracker Status Icon" className={styles.icon} />Tracker Status Survei
            </a>
            <a href="/clients">
              <img src="/images/Client.svg" alt="Daftar Klien Icon" className={styles.icon} />Daftar Klien
            </a>
            <a href="/surveys">
              <img src="/images/Survey.svg" alt="Daftar Survey Icon" className={styles.icon} />Daftar Survei
            </a>
          </nav>
          <a href="/login" onClick={handleLogout} className={styles.logout}>
            <img src="/images/Out.svg" alt="Logout Icon" className={styles.icon} />Logout
          </a>
        </aside>

        {/* Main Content */}
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
                        checked
                        readOnly
                        />
                    <label htmlFor="proposal">Proposal</label>
                    <input 
                        type="radio" 
                        id="kontrak" 
                        name="docType" 
                        value="kontrak" 
                        checked={docType === 'kontrak'}
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
                        checked={docType === 'invoiceFinal'}
                        onChange={handleDocTypeChange}
                        />
                    <label htmlFor="invoiceFinal">Invoice Final</label>
                    <input 
                        type="radio" 
                        id="kwitansiDP" 
                        name="docType" 
                        value="kwitansiDP" 
                        checked={docType === 'kwitansiDP'}
                        onChange={handleDocTypeChange}
                        />
                    <label htmlFor="kwitansiDP">Kwitansi DP</label>
                    <input 
                        type="radio" 
                        id="kwitansiFinal" 
                        name="docType" 
                        value="kwitansiFinal" 
                        checked={docType === 'kwitansiFinal'}
                        onChange={handleDocTypeChange}
                        />
                    <label htmlFor="kwitansiFinal">Kwitansi Final</label>
                </div>
            </div>

            <div className={styles.subtitle}>
                Template Proposal Survey
            </div>
            

            {/* Export Button */}
            <div className={styles.buttonGroup}>
                <button type="button" className={styles.uploadButton}>Upload Template Baru</button>
                <button type="button" className={styles.exportButton} onClick={handleExport}>
                <img src="/images/AddItem.svg" alt="Export Icon" />Export
                </button>
            </div>

            
        </div>
      </div>
      <div className={styles.footer}>
        @2024 optimasys | Contact optimasys.work@gmail.com
    </div>
    </div>
    
  );
};

export default Proposal;
