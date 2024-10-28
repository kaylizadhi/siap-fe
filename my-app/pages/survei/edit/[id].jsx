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
            alert("Gagal membuat survei")
        }
    }
    return (
        <div className={styles.manajemenDataKlien}>
      			<b className={styles.contact}>Contact</b>
      			<b className={styles.daftarKlien}>Daftar Klien</b>
      			<img className={styles.groupIcon} alt="" src="Group.svg" />
      			<div className={styles.navigationBar}>
        				<div className={styles.logoParent}>
          					<div className={styles.logo}>
            						<b className={styles.i}>I</b>
            						<b className={styles.s}>S</b>
            						<b className={styles.a}>A</b>
            						<b className={styles.p}>P</b>
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
      			<div className={styles.textFieldParent}>
        				<div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Judul Survei</b>
            						</div>
                                        <input className={styles.container} type='text' name='judulsurvei' value={survei.nama_survei || ''} onChange={(event) => setSurvei({...survei, nama_survei: event.target.value})}></input>
          					</div>
        				</div>
        				<div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Nama Perusahaan</b>
            						</div>
            						<input className={styles.container} type='text' name='namaklien'  value={survei.nama_klien || ''} onChange={(event) => setSurvei({...survei, nama_klien: event.target.value})}></input>
          					</div>
        				</div>
        				<div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Daerah</b>
            						</div>
            						<input className={styles.container} type='text' name='ruanglingkup' value={survei.ruang_lingkup_survei || ''} onChange={(event) => setSurvei({...survei, ruang_lingkup_survei: event.target.value})}></input>
          					</div>
        				</div>
        				<div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Harga</b>
            						</div>
            						<input className={styles.container} type='text' name='hargasurvei' value={survei.harga_survei || ''} onChange={(event) => setSurvei({...survei, harga_survei: event.target.value})}></input>
          					</div>
        				</div>
                        <div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Jumlah Responden</b>
            						</div>
            						<input className={styles.container} type='text' name='jumlahresponden' value={survei.jumlah_responden || ''} onChange={(event) => setSurvei({...survei, jumlah_responden: event.target.value})}></input>
          					</div>
        				</div>
                        <div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Tanggal Mulai</b>
            						</div>
            						<input min={new Date().toISOString().split("T")[0]} className={styles.container} type='date' name='tanggalmulai' value={survei.waktu_mulai_survei || (survei && survei.waktu_mulai_survei ? survei.waktu_mulai_survei.split("T")[0]:"")} onChange={(event) => setSurvei({...survei, waktu_mulai_survei: event.target.value})}></input>
          					</div>
        				</div>
                        <div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Tanggal Berakhir</b>
            						</div>
            						<input min={new Date().toISOString().split("T")[0]} className={styles.container} type='date' name='tanggalberakhir' value={survei.waktu_berakhir_survei || (survei && survei.waktu_berakhir_survei ? survei.waktu_berakhir_survei.split("T")[0]:"")} onChange={(event) => setSurvei({...survei, waktu_berakhir_survei: event.target.value})}></input>
          					</div>
        				</div>
                        <div className={styles.textField}>
          					<div className={styles.dashboardButtonParent}>
            						<div className={styles.title}>
              							<b className={styles.text}>Tipe Survei</b>
            						</div>
            						<select className={styles.container} type='text' name='tipesurvei' value={survei.tipe_survei || ''} onChange={(event) => setSurvei({...survei, tipe_survei: event.target.value})}>
                                        <option value="Paper-based">Paper-based</option>
                                        <option value="Digital">Digital</option>
                                        <option value="Paper-based">Lainnya</option>
                                    </select>
          					</div>  
        				</div>
      			</div>
      			
        				
          					<div className={styles.buttondesktopWeb1}>
            						<button onClick={() => HandleSubmit()} className={styles.text}>Simpan</button>
          					</div>
        				
        				<div className={styles.button2}>
          					<div className={styles.buttondesktopWeb2}>
            						<button className={styles.text}>Batal</button>
          					</div>
        				</div>
      			
    		</div>);
}