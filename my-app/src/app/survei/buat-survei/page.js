"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../index.module.css";
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'; 

export default function BuatSurvei() {
  const [survei, setSurvei] = useState({});
  const [klien, setKlien] = useState([]);
  const [daerahOptions, setDaerahOptions] = useState([]);
  const router = useRouter();
  const [wilayahSurvei, setWilayahSurvei] = useState([]);

	const handleBackToSurvei = () => {
		router.push("/survei"); 
	};

  // Fungsi untuk mengambil data daerah berdasarkan parameter ruang lingkup
  const fetchDaerah = async (param) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/survei/lokasi?param=${param}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setDaerahOptions(data); // Set hasil ke opsi daerah
    } catch (error) {
      console.error("Error fetching daerah:", error);
      setDaerahOptions([]); // Kosongkan opsi daerah jika terjadi error
    }
  };

  // Fungsi untuk mengambil daftar klien dari API
  const fetchKlien = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/klien/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setKlien(data); // Set hasil ke daftar klien
    } catch (error) {
      console.error("Error fetching klien:", error);
      setKlien([]); // Kosongkan daftar klien jika terjadi error
    }
  };

  // Memuat data klien saat komponen pertama kali dirender
  useEffect(() => {
    fetchKlien();
  }, []);

  // Fungsi untuk menangani perubahan ruang lingkup survei
  const handleRuangLingkupChange = (event) => {
    const value = event.target.value;
    setSurvei({ ...survei, ruang_lingkup: value });
    fetchDaerah(value);
  };

  const addDaerah = () => {
    const daerahSelect = document.getElementById("daerahSelect");
    const selectedId = daerahSelect.value;
    const selectedName = daerahSelect.options[daerahSelect.selectedIndex].text;

    if (selectedId) {
      // Cek apakah daerah sudah ada di daftar
      if (!wilayahSurvei.some((item) => item.id === selectedId)) {
        setWilayahSurvei([
          ...wilayahSurvei,
          { id: selectedId, name: selectedName },
        ]);
      } else {
        alert(`${selectedName} sudah ada dalam daftar.`);
      }
    } else {
      alert("Pilih daerah terlebih dahulu.");
    }
  };

  // Fungsi untuk menghapus daerah dari daftar wilayah survei
  const removeDaerah = (id) => {
    setWilayahSurvei(wilayahSurvei.filter((item) => item.id !== id));
  };

  // Fungsi untuk mengirim data survei ke backend
  const handleSubmit = async () => {
	// Validasi input
	if (!survei.nama_survei) {
		alert("Judul survei tidak boleh kosong.");
		return; 
	}
	if (!survei.harga_survei || isNaN(survei.harga_survei)) {
		alert("Harga survei tidak boleh kosong.");
		return; 
	}
	if (!survei.jumlah_responden || isNaN(survei.jumlah_responden)) {
		alert("Jumlah responden tidak boleh kosong.");
		return;
	}

    try {
      const surveiData = { ...survei, wilayah_survei: wilayahSurvei };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}survei/add-survei/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveiData),
        }
      );
      const result = await response.json();
      if (result?.success) {
        router.push("/survei"); // Redirect jika berhasil
      }
    } catch (error) {
      console.error("Error submitting survei:", error);
	  router.push("/survei");
    }
  };

    return (
        <div>
      		<b className={styles.headingSurvei}>Daftar Survei</b>  
			<div className={styles.containerSurvei}>
				<b className={styles.textFieldTitleSurvei}>Judul Survei</b>
					<input className={styles.textFieldSurvei} type='text' name='judulsurvei' placeholder='Masukkan judul survei' onChange={(event) => setSurvei({...survei, nama_survei: event.target.value})}></input>
				<b className={styles.textFieldTitleSurvei}>Nama Klien</b>
					<input className={styles.textFieldSurvei} type='text' name='namaklien' placeholder='Masukkan nama klien' onChange={(event) => setSurvei({...survei, klien_id: event.target.value})}></input>
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
  return (
    <div>
		<b className={styles.headingSurvei}>Daftar Survei</b>
		<form onSubmit={handleSubmit} className={styles.containerSurvei}>
			<b className={styles.textFieldTitleSurvei}>Nama Survei</b>
			<input
				className={styles.textFieldSurvei}
				type="text"
				placeholder="Masukkan judul survei"
				onChange={(event) => setSurvei({ ...survei, nama_survei: event.target.value })}
			/>

        <b className={styles.textFieldTitleSurvei}>Nama Klien</b>
		<select
          	className={styles.textFieldSurveiDropdown}
          	onChange={(event) => setSurvei({ ...survei, klien_id: event.target.value })}
        >
          	<option value="">Pilih Klien</option>
          		{klien.map((e) => (
            <option key={e.id} value={e.id}>
              	{e.nama_klien}
            </option>
          	))}
        </select>

        <b className={styles.textFieldTitleSurvei}>Ruang Lingkup Survei</b>
        <div className={styles.radioGroupSurvei}>
          	{["Nasional", "Provinsi", "Kota"].map((scope) => (
            <label key={scope}>
              	<input
                	type="radio"
                	name="ruanglingkup"
                	value={scope}
                	onChange={handleRuangLingkupChange}/>
              		{scope}
            </label>))}
        </div>

        <b className={styles.textFieldTitleSurvei}>Daerah</b>
        <ul className={styles.daerahList}>
          	{wilayahSurvei.map((daerah) => (
            <li key={daerah.id} className={styles.daerahList}>
            {daerah.name}
            <button
                style={{ marginLeft: "10px" }}
                onClick={() => removeDaerah(daerah.id)}>
                Hapus
            </button>
            </li>
          ))}
        </ul>

        <select id="daerahSelect" className={styles.textFieldSurveiDropdown}>
          <option value="">Pilih Daerah</option>
          {daerahOptions.map((daerah) => (
            <option key={daerah.id} value={daerah.id}>
              {daerah.name}
            </option>
          ))}
        </select>
		<PlusIcon 
			className={styles.iconEdit} 
			onClick={addDaerah}
		/>

        <b className={styles.textFieldTitleSurvei}>Harga</b>
        <input
          className={styles.textFieldSurvei}
          type="number"
          placeholder="Masukkan harga"
          onChange={(event) =>
            setSurvei({ ...survei, harga_survei: event.target.value })
          }
        />
        <b className={styles.textFieldTitleSurvei}>Jumlah Responden</b>
        <input
          className={styles.textFieldSurvei}
          type="number"
          placeholder="Masukkan jumlah responden"
          onChange={(event) =>
            setSurvei({ ...survei, jumlah_responden: event.target.value })
          }
        />
        <b className={styles.textFieldTitleSurvei}>Tanggal Mulai</b>
        <input
          min={new Date().toISOString().split("T")[0]}
          className={styles.textFieldSurvei}
          type="date"
          onChange={(event) =>
            setSurvei({ ...survei, waktu_mulai_survei: event.target.value })
          }
        />
        <b className={styles.textFieldTitleSurvei}>Tanggal Berakhir</b>
        <input
          min={new Date().toISOString().split("T")[0]}
          className={styles.textFieldSurvei}
          type="date"
          onChange={(event) =>
            setSurvei({ ...survei, waktu_berakhir_survei: event.target.value })
          }
        />
        <b className={styles.textFieldTitleSurvei}>Tipe Survei</b>
        <select
          className={styles.textFieldSurveiDropdown}
          onChange={(event) =>
            setSurvei({ ...survei, tipe_survei: event.target.value })
          }
        >
          <option value="Paper-based">Paper-based</option>
          <option value="Digital">Digital</option>
          <option value="Lainnya">Lainnya</option>
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
    </div>
  );
}