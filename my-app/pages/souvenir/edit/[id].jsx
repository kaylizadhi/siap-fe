import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../index.module.css';
export default function EditSouvenir(){
    const router = useRouter();
    const { id } = router.query;
    const [souvenir, setSouvenir] = useState({});
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
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchingData();
    }, [id]);
    const HandleSubmit = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/update-souvenir/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body : JSON.stringify(souvenir),
                }
                
            );
            const result = await response.json();
            if (result?.success){
                router.push("/souvenir");
            }
        } catch (error){
            console.log("response", souvenir)
            alert("Gagal menyimpan perubahan informasi souvenir")
        }
    }
    return (
        <div>
			<b className={styles.headingSouvenir}>Tracker Souvenir</b>
			<div className={styles.containerSouvenir}>
				<b className={styles.textFieldTitleSouvenir}>Nama Souvenir</b>
					<input className={styles.textFieldSouvenir} type='text' name='namasouvenir' value={souvenir.nama_souvenir|| ''} onChange={(event) => setSouvenir({...souvenir, nama_souvenir: event.target.value})}></input>
				<b className={styles.textFieldTitleSouvenir}>Jumlah stok</b>
					<input className={styles.textFieldSouvenir} type='text' name='jumlahstok' value={souvenir.jumlah_stok || ''} onChange={(event) => setSouvenir({...souvenir, jumlah_stok: event.target.value})}></input>
				<b className={styles.textFieldTitleSouvenir}>Jumlah minimum</b>
					<input className={styles.textFieldSouvenir} type='text' name='jumlahminimum' value={souvenir.jumlah_minimum || ''} onChange={(event) => setSouvenir({...souvenir, jumlah_minimum: event.target.value})}></input>
      		</div>
			<button onClick={() => HandleSubmit()} className={styles.primaryButtonSouvenir}>Simpan</button>	
			<button className={styles.secondaryButtonSouvenir}>Batal</button>
    		</div>);
}