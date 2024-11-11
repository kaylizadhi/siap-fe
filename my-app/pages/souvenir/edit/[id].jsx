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
    const handleBackToSouvenir = () => {
        router.push("/souvenir"); 
    };
    return (
        <div>
			<b className={styles.headingSouvenir}>Edit Souvenir</b>
            <div className={styles.containerSouvenir}>
                <b className={styles.textFieldTitleSouvenir}>Nama Souvenir</b>
                <input 
                    className={styles.textFieldSouvenir} 
                    type="text" 
                    name="namasouvenir" 
                    value={souvenir.nama_souvenir || ''} 
                    placeholder={souvenir.nama_souvenir || ''}  // Bisa diisi dengan teks statis jika diinginkan
                    onChange={(event) => setSouvenir({...souvenir, nama_souvenir: event.target.value})} 
                />
                
                <b className={styles.textFieldTitleSouvenir}>Jumlah Stok</b>
                <input 
                    className={styles.textFieldSouvenir} 
                    type="number" 
                    name="jumlahstok" 
                    value={souvenir.jumlah_stok || ''} 
                    placeholder={souvenir.jumlah_stok || ''}
                    onChange={(event) => setSouvenir({...souvenir, jumlah_stok: event.target.value})} 
                />
                
                <b className={styles.textFieldTitleSouvenir}>Jumlah Minimum</b>
                <input 
                    className={styles.textFieldSouvenir} 
                    type="number" 
                    name="jumlahminimum" 
                    value={souvenir.jumlah_minimum || ''} 
                    placeholder={souvenir.jumlah_minimum || ''} 
                    onChange={(event) => setSouvenir({...souvenir, jumlah_minimum: event.target.value})} 
                />
            </div>

			<button 
                type="submit"
                onClick={() => HandleSubmit()} 
                className={styles.primaryButtonSouvenir2}>
                    Simpan</button>	
			<button 
                type="button"
                onClick={handleBackToSouvenir}
                className={styles.secondaryButtonSouvenir2}>
                    Kembali</button>
    		</div>);
}