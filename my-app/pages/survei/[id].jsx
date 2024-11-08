import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { useRouter } from "next/router";

export default function Detail() {
    const router = useRouter();
    const [survei, setSurvei] = useState({});
    const { id } = router?.query;

    function formatDateTime(dateTimeString){
        const options = {
            day:"numeric",
            month:"long",
            year:"numeric"
        };
        const formattedDate = new Date(dateTimeString).toLocaleDateString(
            "id-ID",options
        );
        return formattedDate;
        
    }
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
    return (
        <div>
			<b className={styles.headingSurvei}>Daftar Klien</b>
			<div className={styles.idContainer}>
				<div>Judul Survei : {survei.nama_survei}</div>
				<div>Nama Klien : {survei.nama_klien}</div>
				<div>Daerah : {survei.wilayah_survei}</div>
				<div>Jumlah Responden : {survei.jumlah_responden}</div>
				<div>Harga Survei : {survei.harga_survei}</div>
				<div>Tanggal Mulai : {survei.waktu_mulai_survei && formatDateTime(survei.waktu_mulai_survei)}</div>
				<div>Tanggal Selesai : {survei.waktu_berakhir_survei && formatDateTime(survei.waktu_berakhir_survei)}</div>
				<div>Tipe Survei : {survei.tipe_survei}</div>
			</div>
    	</div>);
    ;
}
