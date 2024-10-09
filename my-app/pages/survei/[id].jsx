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
        <div className={styles.manajemenDataKlien}>
      			<b className={styles.contact}>Contact</b>
      			<b className={styles.daftarKlien}>Daftar Klien</b>
      			<img className={styles.groupIcon} alt="" src="Group.svg" />
      			<div className={styles.navigationBar}>
        				<div className={styles.logoParent}>
          					<div className={styles.logo}>
            						<img className={styles.logoChild} alt="" src="Group 1.svg" />
          					</div>
          					<b className={styles.siapSistemInformasiContainer}>
            						<span className={styles.siapSistemInformasiContainer1}>
              							<p className={styles.siap}>SIAP</p>
              							<p className={styles.sistemInformasiAdministrasi}>Sistem Informasi Administrasi dan Pengendalian Mutu</p>
            						</span>
          					</b>
        				</div>
        				<div className={styles.frameParent}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Red)/Home.svg" />
              							<b className={styles.dashboard}>Dashboard</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Profile.svg" />
              							<b className={styles.dashboard1}>Ubah Profil</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Add.svg" />
              							<b className={styles.dashboard2}>Buat Akun</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Create.svg" />
              							<b className={styles.dashboard3}>Buat Dokumen</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Document.svg" />
              							<b className={styles.dashboard4}>Daftar Dokumen</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Inventory.svg" />
              							<b className={styles.dashboard4}>Tracker Souvenir</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Status.svg" />
              							<b className={styles.dashboard6}>Tracker Status Survei</b>
            						</div>
            						<div className={styles.dashboardButton1}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Red)/Client.svg" />
              							<b className={styles.dashboard7}>Daftar Klien</b>
            						</div>
            						<div className={styles.dashboardButton}>
              							<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Survey.svg" />
              							<b className={styles.dashboard8}>Daftar Survei</b>
            						</div>
          					</div>
          					<div className={styles.dashboardButton}>
            						<img className={styles.iconsRedhome} alt="" src="Icons (Black)/Out.svg" />
            						<b className={styles.dashboard9}>Logout</b>
          					</div>
        				</div>
      			</div>
      			<div className={styles.button}>
        				<div className={styles.buttondesktopWeb}>
          					<b className={styles.text}>@2024 optimasys | Contact optimasys.work@gmail.com</b>
        				</div>
      			</div>
      			<div className={styles.frameGroup}>
        				<div className={styles.namaKlienParent}>
          					<div className={styles.namaKlien}>Judul Survei {survei.nama_survei}</div>
          					<div className={styles.namaKlien}>Nama Klien {survei.nama_klien}</div>
          					<div className={styles.namaKlien}>Daerah {survei.wilayah_survei}</div>
          					<div className={styles.namaKlien}>Jumlah Responden {survei.jumlah_responden}</div>
                            <div className={styles.namaKlien}>Harga Survei {survei.harga_survei}</div>
                            <div className={styles.namaKlien}>Tanggal Mulai {survei.waktu_mulai_survei && formatDateTime(survei.waktu_mulai_survei)}</div>
                            <div className={styles.namaKlien}>Tanggal Selesai {survei.waktu_berakhir_survei && formatDateTime(survei.waktu_berakhir_survei)}</div>
                            <div className={styles.namaKlien}>Tipe Survei {survei.tipe_survei}</div>
        				</div>
      			</div>
    		</div>);
    ;
}
