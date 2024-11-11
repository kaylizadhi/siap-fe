"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/generator-dokumen.module.css";

const Proposal = () => {
  const router = useRouter();
  const [docType, setDocType] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/accounts/check_role_proposal/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data = await response.json();

        if (
          data.error ||
          (data.role !== "Administrasi" && data.role !== "Eksekutif")
        ) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    const fetchSlideImage = async () => {
      const response = await fetch(
        "http://localhost:8000/dokumen_pendukung/convert_pptx_to_image/"
      );
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

  const handleUploadClick = () => {
    setIsVisible(!isVisible);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".ppt")) {
      setFile(uploadedFile);
    } else {
      alert("Only .ppt files are allowed.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".ppt")) {
      setFile(droppedFile);
    } else {
      alert("Only .ppt files are allowed.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/dokumen_pendukung/download_template_proposal/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download the template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "templateProposal.ppt";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleDocTypeChange = (e) => {
    const selectedDocType = e.target.value;
    setDocType(selectedDocType);

    if (selectedDocType === "invoiceDP") {
      router.push("/generator-dokumen/invoice-dp");
    }
    if (selectedDocType === "invoiceFinal") {
      router.push("/generator-dokumen/invoice-final");
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

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const confirmUpload = window.confirm("Apakah anda yakin ingin mengubah template proposal pada sistem?");

    if (confirmUpload && file) {
      // Proceed with upload if user confirms
      const formData = new FormData();
      formData.append('template', file);

      

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/dokumen_pendukung/upload_template_proposal/', {
          method: 'POST',
          headers: { 'Authorization': `Token ${token}` },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload the template");
        }
  
        alert("Template uploaded successfully!");
        setIsVisible(!isVisible);
        setFile();
      } catch (error) {
        console.error('Error uploading template:', error);
        alert("Error uploading template");
      }
    }    
  };


  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Buat Dokumen</h1>

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

            <img 
                src="/images/proposal_preview.png"  
                alt="Template Preview" 
                className={styles.image}  
            />
            

            {/* Export Button */}
            <div className={styles.buttonGroup}>
                <button type="button" onClick={handleUploadClick} className={styles.uploadButton}>Upload Template Baru</button>
                <button type="button" className={styles.exportButton} onClick={handleExport}>
                <img src="/images/AddItem.svg" alt="Export Icon" />Export
                </button>
            </div>
            <div>
              {isVisible && (
                <div
                  className={styles.uploadContainer}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <label className={styles.fileInputLabel} htmlFor="fileInput">
                    <img src="/images/upload_icon.svg" alt="Upload Icon" className={styles.uploadIcon} />
                    <p>Unggah Dokumen</p>
                    {/* <p className={styles.uploadSubtitle}>Ukuran maksimal:</p> */}
                    <p className={styles.uploadSubtitle}>Format file: .ppt</p>
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".ppt"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  {file && <p>Selected file: {file.name}</p>}
                  <button type="button" onClick={handleUpload} className={styles.uploadConfirmButton}>Upload</button>
                </div>
              )}
            </div>

            
        </div>
      </div>

      <div className={styles.subtitle}>Template Proposal Survey</div>

      <img
        src="/images/proposal_preview.png"
        alt="Template Preview"
        className={styles.image}
      />

      {/* Export Button */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleUploadClick}
          className={styles.uploadButton}
        >
          Upload Template Baru
        </button>
        <button
          type="button"
          className={styles.exportButton}
          onClick={handleExport}
        >
          <img src="/images/AddItem.svg" alt="Export Icon" />
          Export
        </button>
      </div>

      {isVisible && (
        <div
          className={styles.uploadContainer}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label className={styles.fileInputLabel} htmlFor="fileInput">
            <img
              src="/images/upload_icon.svg"
              alt="Upload Icon"
              className={styles.uploadIcon}
            />
            <p>Unggah Dokumen</p>
            <p className={styles.uploadSubtitle}>Ukuran maksimal:</p>
            <p className={styles.uploadSubtitle}>Format file: .ppt</p>
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".ppt"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {file && <p>Selected file: {file.name}</p>}
        </div>
      )}
    </div>
  );
};

export default Proposal;
