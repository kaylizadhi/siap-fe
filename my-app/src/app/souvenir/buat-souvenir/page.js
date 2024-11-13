"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../index.module.css';

export default function BuatSouvenir() {
    const [souvenir, setSouvenir] = useState({
        nama_souvenir: '',
        jumlah_stok: '',
        jumlah_minimum: ''
    });
    const router = useRouter();

    const handleBackToSouvenir = () => {
        router.push("/souvenir"); 
    };

    const handleSubmit = async (event) => {  
        event.preventDefault();

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

        // Mengubah jumlah_stok dan jumlah_minimum menjadi angka
        const newSouvenir = {
            ...souvenir,
            jumlah_stok: parseInt(souvenir.jumlah_stok),
            jumlah_minimum: parseInt(souvenir.jumlah_minimum),
        };

        try {
            // Cek apakah souvenir dengan nama yang sama ada, termasuk yang soft-deleted
            const checkResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/check-souvenir/${souvenir.nama_souvenir}/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            );
            const checkResult = await checkResponse.json();

            if (checkResponse.ok) {
                if (checkResult?.is_deleted === true) {
                    // Jika souvenir ada dan is_deleted = true, update status is_deleted menjadi false
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/update-souvenir/${checkResult.id}/`, {
                            method: 'PATCH',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                ...newSouvenir,
                                is_deleted: false,  // Mengubah status menjadi tidak terhapus
                            }),
                        }
                    );
                    const result = await response.json();
                    if (response.ok && result?.id) {
                        alert("Berhasil memperbarui souvenir yang sudah dihapus!");
                        router.push("/souvenir");
                    } else {
                        alert("Gagal memperbarui souvenir!");
                    }
                } else {
                    // Jika souvenir sudah ada dan tidak terhapus, beri pesan bahwa sudah ada
                    alert("Souvenir dengan nama ini sudah ada.");
                }
            } else {
                // Jika souvenir belum ada, tambahkan souvenir baru
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/add-souvenir/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newSouvenir),
                    }
                );
                const result = await response.json();
                if (response.ok && result?.id) {
                    alert("Berhasil menambahkan souvenir!");
                    router.push("/souvenir");
                } else {
                    alert("Gagal menambahkan souvenir!");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal menambahkan souvenir!");
        }
    }

    return (
        <div>
            <b className={styles.headingSouvenir}>Tambah Souvenir</b>
            <form onSubmit={handleSubmit} className={styles.containerSouvenir}>
                <b className={styles.textFieldTitleSouvenir}>Nama Souvenir</b>
                <input
                    className={styles.textFieldSouvenir}
                    type='text'
                    name='namasouvenir'
                    placeholder='Masukkan nama souvenir'
                    onChange={(event) => setSouvenir({ ...souvenir, nama_souvenir: event.target.value })}
                />
                <b className={styles.textFieldTitleSouvenir}>Jumlah Stok</b>
                <input
                    className={styles.textFieldSouvenir}
                    type='number'
                    name='jumlahstok'
                    placeholder='Masukkan jumlah stok'
                    onChange={(event) => setSouvenir({ ...souvenir, jumlah_stok: event.target.value })}
                />
                <b className={styles.textFieldTitleSouvenir}>Jumlah Minimum</b>
                <input
                    className={styles.textFieldSouvenir}
                    type='number'
                    name='jumlahminimum'
                    placeholder='Masukkan jumlah minimum'
                    onChange={(event) => setSouvenir({ ...souvenir, jumlah_minimum: event.target.value })}
                />
                <button 
                    type="submit" 
                    className={styles.primaryButtonSouvenir}>
                        Simpan
                </button>
                <button 
                    type="button" 
                    onClick={handleBackToSouvenir}
                    className={styles.secondaryButtonSouvenir}>
                        Batal
                </button>
            </form>
        </div>
    );
}
