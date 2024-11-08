import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
export default function BuatSouvenir() {
    const [souvenir, setSouvenir] = useState();
    const router = useRouter();
    const HandleSubmit = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/add-souvenir/`, {
                    method: 'POST',
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
            alert("Gagal membuat souvenir")
        }
    }

    return (
        <div>
      		<b className={styles.headingSouvenir}>Tracker Souvenir</b>  
			<div className={styles.containerSouvenir}>
				<b className={styles.textFieldTitleSouvenir}>Nama Souvenir</b>
					<input className={styles.textFieldSouvenir} type='text' name='namasouvenir' placeholder='Masukkan nama souvenir' onChange={(event) => setSouvenir({...souvenir, nama_souvenir: event.target.value})}></input>
				<b className={styles.textFieldTitleSouvenir}>Jumlah Stok</b>
					<input className={styles.textFieldSouvenir} type='text' name='jumlahstok' placeholder='Masukkan jumlah stok' onChange={(event) => setSouvenir({...souvenir, jumlah_stok: event.target.value})}></input>
				<b className={styles.textFieldTitleSouvenir}>Jumlah Minimum</b>
					<input className={styles.textFieldSouvenir} type='text' name='jumlahminimum' placeholder='Masukkan jumlah minimum' onChange={(event) => setSouvenir({...souvenir, jumlah_minimum: event.target.value})}></input>
			</div>			
			<button onClick={() => HandleSubmit()} className={styles.primaryButtonSouvenir}>Simpan</button>	
			<button className={styles.secondaryButtonSouvenir}>Batal</button>
    	</div>);
};