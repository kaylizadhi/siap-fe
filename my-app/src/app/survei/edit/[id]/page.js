"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from '../../index.module.css';

export default function EditSurvei(){
    const router = useRouter();
    const params = useParams();
    const [klien, setKlien] = useState([]);
    const [daerahOptions, setDaerahOptions] = useState([]);
    const id = params.id;
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
        if (id) {
            fetchingData();
        }
    }, [id]);
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
        setDaerahOptions(data);
      } catch (error) {
        console.error("Error fetching daerah:", error);
        setDaerahOptions([]);
      }
    };

    const fetchKlien = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/klien/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setKlien(data);
      } catch (error) {
        console.error("Error fetching klien:", error);
        setKlien([]);
      }
    };

    useEffect(() => {
      fetchKlien();
    }, []);

    const handleRuangLingkupChange = (event) => {
      const value = event.target.value;
      setSurvei({ ...survei, ruang_lingkup: value });
      fetchDaerah(value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}survei/update-survei/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json"
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
    };

    return (
      <div>
        <b className={styles.headingSurvei}>Daftar Survei</b>
        <div className={styles.containerSurvei}>
          <b className={styles.textFieldTitleSurvei}>Judul Survei</b>
          <input
            className={styles.textFieldSurvei}
            type="text"
            name="judulsurvei"
            value={survei.nama_survei || ""}
            onChange={(event) =>
              setSurvei({ ...survei, nama_survei: event.target.value })
            }
          />
          <b className={styles.textFieldTitleSurvei}>Nama Klien</b>
          <select
            className={styles.textFieldSurvei}
            value={survei.nama_klien || ""}
            onChange={(event) =>
              setSurvei({ ...survei, klien_id: event.target.value })
            }
          >
            <option value="">{survei.nama_klien}</option>
            {klien.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nama_klien}
              </option>
            ))}
          </select>
          <b className={styles.textFieldTitleSurvei}>Ruang Lingkup Survei</b>
          <div className={styles.radioGroupSurvei}>
            <label>
              <input
                type="radio"
                name="ruanglingkup"
                value="Nasional"
                checked={survei.ruang_lingkup === "Nasional"}
                onChange={handleRuangLingkupChange}
              />
              Nasional
            </label>
            <label>
              <input
                type="radio"
                name="ruanglingkup"
                value="Provinsi"
                checked={survei.ruang_lingkup === "Provinsi"}
                onChange={handleRuangLingkupChange}
              />
              Provinsi
            </label>
            <label>
              <input
                type="radio"
                name="ruanglingkup"
                value="Kabupaten/Kota"
                checked={survei.ruang_lingkup === "Kabupaten/Kota"}
                onChange={handleRuangLingkupChange}
              />
              Kabupaten/Kota
            </label>
          </div>
          <b
            className={styles.textFieldTitleSurvei}
            style={{ marginTop: "12px" }}
          >
            Daerah
          </b>
          <select
            className={styles.textFieldSurvei}
            value={survei.wilayah_survei || ""}
            onChange={(event) =>
              setSurvei({ ...survei, wilayah_survei: event.target.value })
            }
          >
            <option value="">{survei.wilayah_survei}</option>
            {daerahOptions.map((daerah) => (
              <option key={daerah.id} value={daerah.id}>
                {daerah.name}
              </option>
            ))}
          </select>
          <b className={styles.textFieldTitleSurvei}>Harga</b>
          <input
            className={styles.textFieldSurvei}
            type="text"
            name="hargasurvei"
            value={survei.harga_survei || ""}
            onChange={(event) =>
              setSurvei({ ...survei, harga_survei: event.target.value })
            }
          />
          <b className={styles.textFieldTitleSurvei}>Jumlah Responden</b>
          <input
            className={styles.textFieldSurvei}
            type="text"
            name="jumlahresponden"
            value={survei.jumlah_responden || ""}
            onChange={(event) =>
              setSurvei({ ...survei, jumlah_responden: event.target.value })
            }
          />
          <b className={styles.textFieldTitleSurvei}>Tanggal Mulai</b>
          <input
            min={new Date().toISOString().split("T")[0]}
            className={styles.container}
            type="date"
            name="tanggalmulai"
            value={
              survei.waktu_mulai_survei
                ? survei.waktu_mulai_survei.split("T")[0]
                : ""
            }
            onChange={(event) =>
              setSurvei({ ...survei, waktu_mulai_survei: event.target.value })
            }
          />
          <b className={styles.textFieldTitleSurvei}>Tanggal Berakhir</b>
          <input
            min={new Date().toISOString().split("T")[0]}
            className={styles.container}
            type="date"
            name="tanggalberakhir"
            value={
              survei.waktu_berakhir_survei
                ? survei.waktu_berakhir_survei.split("T")[0]
                : ""
            }
            onChange={(event) =>
              setSurvei({
                ...survei,
                waktu_berakhir_survei: event.target.value,
              })
            }
          />
          <b className={styles.textFieldTitleSurvei}>Tipe Survei</b>
          <select
            className={styles.textFieldSurvei}
            type="text"
            name="tipesurvei"
            value={survei.tipe_survei || ""}
            onChange={(event) =>
              setSurvei({ ...survei, tipe_survei: event.target.value })
            }
          >
            <option value="Paper-based">Paper-based</option>
            <option value="Digital">Digital</option>
            <option value="Paper-based">Lainnya</option>
          </select>
        </div>
        <button onClick={handleSubmit} className={styles.primaryButtonSurvei}>
          Simpan
        </button>
        <button className={styles.secondaryButtonSurvei}>Batal</button>
      </div>
    );
}