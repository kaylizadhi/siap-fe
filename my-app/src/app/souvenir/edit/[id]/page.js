"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { PencilIcon } from '@heroicons/react/24/solid';  
import styles from '../../index.module.css';

export default function EditSouvenir() {
    const router = useRouter();
    const params = useParams(); 
    const id = params.id;
    const [souvenir, setSouvenir] = useState({});
    const [originalSouvenir, setOriginalSouvenir] = useState({});  
    const [isEditableNama, setIsEditableNama] = useState(false);  
    const [isEditableStok, setIsEditableStok] = useState(false); 
    const [isEditableMinimum, setIsEditableMinimum] = useState(false);  
    const [isChanged, setIsChanged] = useState(false);  

    useEffect(() => {
        async function fetchingData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}souvenir/get-souvenir-detail/${id}/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const listSouvenir = await res.json();
                setSouvenir(listSouvenir);
                setOriginalSouvenir(listSouvenir);  
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        if (id) {
            fetchingData();
        }
    }, [id]);

    const handleSubmit = async () => {
        try {
            // Validasi input
            if (!souvenir.nama_souvenir) {
                alert("Nama souvenir tidak boleh kosong.");
                return; 
            }
            if (!souvenir.jumlah_stok || isNaN(souvenir.jumlah_stok)) {
                alert("Jumlah stok tidak boleh kosong.");
                return; 
            }
            if (!souvenir.jumlah_minimum || isNaN(souvenir.jumlah_minimum)) {
                alert("Jumlah minimum tidak boleh kosong.");
                return;
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/update-souvenir/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify(souvenir),
                }
            );
            const result = await response.json();
            if (response.ok && result?.id) {
                alert("Berhasil mengedit souvenir!");
                router.push("/souvenir");
            } else {
                alert("Gagal mengedit souvenir!");
            }
        } catch (error){
            console.log("response", souvenir);
            alert("Gagal menyimpan perubahan informasi souvenir");
        }
    };

    const handleBackToSouvenir = () => {
        router.push("/souvenir"); 
    };

    const enableEditNama = () => {
        setIsEditableNama(true); 
    };

    const enableEditStok = () => {
        setIsEditableStok(true);
    };

    const enableEditMinimum = () => {
        setIsEditableMinimum(true); 
    };

    // Monitor perubahan pada input
    const handleChange = (event, field) => {
        const newValue = event.target.value;
        setSouvenir({ ...souvenir, [field]: newValue });
        setIsChanged(true); 
    };

    return (
        <div>
            <b className={styles.headingSouvenir}>Edit Souvenir</b>
            <div className={styles.containerSouvenir}>
                <b className={styles.textFieldTitleSouvenir}>Nama Souvenir</b>
                <div className={styles.inputContainer}>
                    <input 
                        className={styles.textFieldSouvenir} 
                        type="text" 
                        name="namasouvenir" 
                        value={souvenir.nama_souvenir || ''}  
                        onChange={(event) => handleChange(event, "nama_souvenir")}  
                        disabled={!isEditableNama}  
                    />
                    <PencilIcon 
                        className={styles.iconEdit} 
                        onClick={enableEditNama}  
                    />
                </div>

                <b className={styles.textFieldTitleSouvenir}>Jumlah Stok</b>
                <div className={styles.inputContainer}>
                    <input 
                        className={styles.textFieldSouvenir} 
                        type="number" 
                        name="jumlahstok" 
                        value={souvenir.jumlah_stok || ''} 
                        onChange={(event) => handleChange(event, "jumlah_stok")} 
                        disabled={!isEditableStok} 
                    />
                    <PencilIcon 
                        className={styles.iconEdit} 
                        onClick={enableEditStok}  
                    />
                </div>

                <b className={styles.textFieldTitleSouvenir}>Jumlah Minimum</b>
                <div className={styles.inputContainer}>
                    <input 
                        className={styles.textFieldSouvenir} 
                        type="number" 
                        name="jumlahminimum" 
                        value={souvenir.jumlah_minimum || ''} 
                        onChange={(event) => handleChange(event, "jumlah_minimum")} 
                        disabled={!isEditableMinimum}  
                    />
                    <PencilIcon 
                        className={styles.iconEdit} 
                        onClick={enableEditMinimum}  
                    />
                </div>
            </div>

            <button 
                type="submit"
                onClick={handleSubmit} 
                className={styles.primaryButtonSouvenir2}
                disabled={!isChanged}  
            >
                Simpan
            </button>	
            <button 
                type="button"
                onClick={handleBackToSouvenir}
                className={styles.secondaryButtonSouvenir2}>
                    Kembali
            </button>
        </div>
    );
}
