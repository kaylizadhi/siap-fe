"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../index.module.css';
export default function BuatSurvei() {
    const [survei, setSurvei] = useState();
    const router = useRouter();

	const handleBackToSurvei = () => {
        router.push("/survei"); 
    };
    const handleSubmit = async (event) => {  
        event.preventDefault();

        // Validasi input
        if (!survei.nama_survei) {
            alert("Nama survei tidak boleh kosong.");
            return; 
        }
        if (!survei.jumlah_stok || isNaN(survei.jumlah_stok)) {
            alert("Jumlah stok tidak boleh kosong.");
            return; 
        }
        if (!survei.jumlah_minimum || isNaN(survei.jumlah_minimum)) {
            alert("Jumlah minimum tidak boleh kosong.");
            return;
        }

        // Mengubah harga dan jumlah_minimum menjadi angka
        const newSurvei = {
            ...survei,
            jumlah_stok: parseInt(survei.jumlah_stok),
            jumlah_minimum: parseInt(survei.jumlah_minimum),
        };

        try {
            // Cek apakah survei dengan nama yang sama ada, termasuk yang soft-deleted
            const checkResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}survei/check-survei/${survei.nama_survei}/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            );
            const checkResult = await checkResponse.json();

            if (checkResponse.ok) {
                if (checkResult?.is_deleted === true) {
                    // Jika survei ada dan is_deleted = true, update status is_deleted menjadi false
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}survei/update-survei/${checkResult.id}/`, {
                            method: 'PATCH',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                ...newSurvei,
                                is_deleted: false,  // Mengubah status menjadi tidak terhapus
                            }),
                        }
                    );
                    const result = await response.json();
                    if (response.ok && result?.id) {
                        alert("Berhasil memperbarui survei yang sudah dihapus!");
                        router.push("/survei");
                    } else {
                        alert("Gagal memperbarui survei!");
                    }
                } else {
                    // Jika survei sudah ada dan tidak terhapus, beri pesan bahwa sudah ada
                    alert("Survei dengan nama ini sudah ada.");
                }
            } else {
                // Jika survei belum ada, tambahkan survei baru
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}survei/add-survei/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newSurvei),
                    }
                );
                const result = await response.json();
                if (response.ok && result?.id) {
                    alert("Berhasil menambahkan survei!");
                    router.push("/survei");
                } else {
                    alert("Gagal menambahkan survei!");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal menambahkan survei!");
        }
    }

    return (
        <div>
      		<b className={styles.headingSurvei}>Daftar Survei</b>
			<form onSubmit={handleSubmit} className={styles.containerSurvei}>  
				<b className={styles.textFieldTitleSurvei}>Judul Survei</b>
					<input className={styles.textFieldSurvei} type='text' name='judulsurvei' placeholder='Masukkan judul survei' onChange={(event) => setSurvei({...survei, nama_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Nama Klien</b>
					<input className={styles.textFieldSurvei} type='text' name='namaklien' placeholder='Masukkan nama klien' onChange={(event) => setSurvei({...survei, nama_klien: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Daerah</b>
					<input className={styles.textFieldSurvei} type='text' name='wilayahsurvei' placeholder='Masukkan wilayah survei' onChange={(event) => setSurvei({...survei, ruang_lingkup_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Harga</b>
					<input className={styles.textFieldSurvei} type='text' name='hargasurvei' placeholder='Masukkan harga' onChange={(event) => setSurvei({...survei, harga_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Jumlah Responden</b>
					<input className={styles.textFieldSurvei} type='text' name='jumlahresponden' placeholder='Masukkan jumlah responden' onChange={(event) => setSurvei({...survei, jumlah_responden: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Tanggal Mulai</b>
					<input min={new Date().toISOString().split("T")[0]} className={styles.textFieldSurvei} type='date' name='tanggalmulai' placeholder='Masukkan tanggal mulai survei'onChange={(event) => setSurvei({...survei, waktu_mulai_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Tanggal Berakhir</b>
					<input min={new Date().toISOString().split("T")[0]} className={styles.textFieldSurvei} type='date' name='tanggalberakhir' placeholder='Masukkan tanggal berakhir survei'onChange={(event) => setSurvei({...survei, waktu_berakhir_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Tipe Survei</b>
					<select className={styles.textFieldSurvei} type='text' name='tipesurvei' onChange={(event) => setSurvei({...survei, tipe_survei: event.target.value})}>
						<option value="Paper-based">Paper-based</option>
						<option value="Digital">Digital</option>
						<option value="Paper-based">Lainnya</option>
					</select>			
			<button 
                    type="submit" 
                    className={styles.primaryButtonSurvei}>
                        Simpan
                </button>
                <button 
                    type="button" 
                    onClick={handleBackToSurvei}
                    className={styles.secondaryButtonSurvei}>
                        Batal
                </button>
			</form>
    	</div>);
};