import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
export default function BuatSurvei() {
    const [survei, setSurvei] = useState();
    const router = useRouter();
    const HandleSubmit = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}survei/add-survei/`, {
                    method: 'POST',
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body : JSON.stringify(survei),
                }
                
            );
            const result = await response.json();
            if (result?.success){
                router.push("/survei");
            }
        } catch (error){
            console.log("response", survei)
            alert("Gagal membuat survei")
        }
    }

    return (
        <div>
      		<b className={styles.headingSurvei}>Daftar Survei</b>  
			<div className={styles.containerSurvei}>
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
			</div>			
			<button onClick={() => HandleSubmit()} className={styles.primaryButtonSurvei}>Simpan</button>	
			<button className={styles.secondaryButtonSurvei}>Batal</button>
    	</div>);
};