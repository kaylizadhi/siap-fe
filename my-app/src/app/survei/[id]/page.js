"use client";

import { useEffect, useState } from "react";
import styles from "../index.module.css";
import { useRouter, useParams } from "next/navigation";

export default function Detail() {
  const router = useRouter();
  const params = useParams();
  const [survei, setSurvei] = useState({});
  const id = params.id;

  const handleBackToSurvei = () => {
    router.push("/survei");
  };

  function formatRupiah(number) {
    const formatted = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
    return `Rp${formatted},-`;
  }

  function formatDateTime(dateTimeString) {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = new Date(dateTimeString).toLocaleDateString("id-ID", options);
    return formattedDate;
  }

  useEffect(() => {
    // Menunggu hingga id ada di query
    if (!id) {
      return; // Jangan lakukan fetch jika id belum ada
    }

    async function fetchingData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/get-survei-detail/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const listSurvei = await res.json();
        setSurvei(listSurvei);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchingData();
  }, [id]); // Dependensi hanya pada id

  if (!id) {
    return <div>Loading...</div>; // Tampilkan loading jika id belum ada
  }

  return (
    <div className={styles.containerOuter}>
      <b className={styles.headingSurvei}>Detail Survei</b>
      <div className={styles.idContainer}>
        <div className={styles.row}>
          <div className={styles.label}>Judul Survei</div>
          <div className={styles.value}>{survei.nama_survei}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Nama Klien</div>
          <div className={styles.value}>{survei.nama_klien}</div>
        </div>
        {/* <div className={styles.row}>
                    <div className={styles.label}>Daerah</div>
                    <div className={styles.value}>{survei.wilayah_survei}</div>
                </div> */}
        <div className={styles.row}>
          <div className={styles.label}>Jumlah Responden</div>
          <div className={styles.value}>{survei.jumlah_responden}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Harga Survei</div>
          <div className={styles.value}>{survei.harga_survei && formatRupiah(survei.harga_survei)}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Tanggal Mulai</div>
          <div className={styles.value}>{survei.waktu_mulai_survei && formatDateTime(survei.waktu_mulai_survei)}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Tanggal Selesai</div>
          <div className={styles.value}>{survei.waktu_berakhir_survei && formatDateTime(survei.waktu_berakhir_survei)}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Tipe Survei</div>
          <div className={styles.value}>{survei.tipe_survei}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Tingkat Survei</div>
          <div className={styles.value}>{survei.ruang_lingkup}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Wilayah Survei</div>
          <div className={styles.value}>{survei.wilayah_survei_names}</div>
        </div>
        <button onClick={handleBackToSurvei} className={styles.secondaryButtonSurvei2}>
          Kembali
        </button>
      </div>
    </div>
  );
}
