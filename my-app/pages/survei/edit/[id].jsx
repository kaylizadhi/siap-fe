import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../index.module.css';
export default function EditSurvei(){
    const router = useRouter();
    const { id } = router.query;
    const [survei, setSurvei] = useState({});
    useEffect(() => {
        async function fetchingData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/get-survei-detail/${id}/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const listSurvei = await res.json();
                setSurvei(listSurvei);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchingData();
    }, [id]);
    const HandleSubmit = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}survei/update-survei/${id}/`, {
                    method: 'PATCH',
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
            alert("Gagal menyimpan perubahan informasi survei")
        }
    }
    return (
        <div>
			<b className={styles.headingSurvei}>Daftar Survei</b>
			<div className={styles.containerSurvei}>
				<b className={styles.textFieldTitleSurvei}>Judul Survei</b>
					<input className={styles.textFieldSurvei} type='text' name='judulsurvei' value={survei.nama_survei || ''} onChange={(event) => setSurvei({...survei, nama_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Nama Klien</b>
					<input className={styles.textFieldSurvei} type='text' name='namaklien'  value={survei.nama_klien || ''} onChange={(event) => setSurvei({...survei, nama_klien: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Daerah</b>
					<input className={styles.textFieldSurvei} type='text' name='ruanglingkup' value={survei.ruang_lingkup_survei || ''} onChange={(event) => setSurvei({...survei, ruang_lingkup_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Harga</b>
					<input className={styles.textFieldSurvei} type='text' name='hargasurvei' value={survei.harga_survei || ''} onChange={(event) => setSurvei({...survei, harga_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Jumlah Responden</b>
					<input className={styles.textFieldSurvei} type='text' name='jumlahresponden' value={survei.jumlah_responden || ''} onChange={(event) => setSurvei({...survei, jumlah_responden: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Tanggal Mulai</b>
					<input min={new Date().toISOString().split("T")[0]} className={styles.container} type='date' name='tanggalmulai' value={survei.waktu_mulai_survei || (survei && survei.waktu_mulai_survei ? survei.waktu_mulai_survei.split("T")[0]:"")} onChange={(event) => setSurvei({...survei, waktu_mulai_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Tanggal Berakhir</b>
					<input min={new Date().toISOString().split("T")[0]} className={styles.container} type='date' name='tanggalberakhir' value={survei.waktu_berakhir_survei || (survei && survei.waktu_berakhir_survei ? survei.waktu_berakhir_survei.split("T")[0]:"")} onChange={(event) => setSurvei({...survei, waktu_berakhir_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Tipe Survei</b>
					<select className={styles.textFieldSurvei} type='text' name='tipesurvei' value={survei.tipe_survei || ''} onChange={(event) => setSurvei({...survei, tipe_survei: event.target.value})}>
						<option value="Paper-based">Paper-based</option>
						<option value="Digital">Digital</option>
						<option value="Paper-based">Lainnya</option>
					</select>
      		</div>
			<button onClick={() => HandleSubmit()} className={styles.primaryButtonSurvei}>Simpan</button>	
			<button className={styles.secondaryButtonSurvei}>Batal</button>
    		</div>);
}