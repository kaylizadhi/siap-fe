"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/dashboard.module.css"; 
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [surveyType, setSurveyType] = useState("");
  const [survei, setSurvei] = useState([]);

  
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/accounts/check_role_dashboard/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data = await response.json();

        if (
          data.error ||
          !["Administrasi", "Eksekutif", "Logistik"].includes(data.role)
        ) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    verifyUser();
  }, [router]);

  const formatDateTime = (dateTimeString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateTimeString).toLocaleDateString("id-ID", options);
  };

  const handleSeeTrackerClick = (id) => {
    const trackerUrl = `/tracker-survei/${id}`;
    router.push(trackerUrl);
  };

  const handleSeeDetailSurveyClick = (id) => {
    const detailSurveyUrl = `/survei/${id}`;
    router.push(detailSurveyUrl);
  };

  const getSurveyIdByIndex = (index) => {
    if (index >= 0 && index < surveyData.length) {
        return surveyData[index].id; 
    } else {
        console.error("Invalid index:", index);
        return null;
    }
  };


  const handleSurveyTypeChange = (e) => {
    const selectedSurveyType = e.target.value;
    setSurveyType(selectedSurveyType);

    const surveyRoutes = {
      nasional: "/dashboard/nasional",
      provinsi: "/dashboard/provinsi",
      kota: "/dashboard/kota",
      keseluruhan: "/dashboard",
  };

  router.push(surveyRoutes[selectedSurveyType]);
};

useEffect(() => {
  async function fetchingData() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/survei-status/dashboard`, {
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
      console.log(listSurvei);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  fetchingData();
}, [page]);

return (
  <div className={styles.containerBackground}>
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Dashboard Progres Survei</h1>

        <div className={styles.surveyTypeSection}>
          <label className={styles.label}>Pilih Jenis Survei</label>
          <div className={styles.radioGroup}>
            {["keseluruhan", "nasional", "provinsi", "kota"].map((type) => (
              <React.Fragment key={type}>
                <input
                  type="radio"
                  id={type}
                  name="surveyType"
                  value={type}
                  checked={surveyType === type}
                  onChange={handleSurveyTypeChange}
                />
                <label htmlFor={type}>Survei {type}</label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama Klien</th>
                <th>Judul Survei</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Berakhir</th>
                <th>Wilayah</th>
                <th>Jumlah Responden</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {survei.map((e) => (
              <tr key={e.survei.id}>
                <td>
                  <img src="/images/Profile.svg" alt="User Icon" className={styles.icon} /> {e.survei.nama_klien}
                </td>
                <td>{e.survei?.nama_survei}</td>
                <td>{e.survei?.waktu_mulai_survei && formatDateTime(e.survei?.waktu_mulai_survei)}</td>
                <td>{e.survei?.waktu_berakhir_survei && formatDateTime(e.survei?.waktu_berakhir_survei)}</td>
                <td>{e.survei?.wilayah_survei}</td>
                <td>{e.survei?.jumlah_responden}</td>
                <td>{e.last_status}</td>
                <td className={styles.actions}>
                  <button className={styles.actionButton} onClick={() => handleSeeDetailSurveyClick(e.survei?.id)}>
                    Lihat Detail Survei
                  </button>

                  <button className={styles.actionButton} onClick={() => handleSeeTrackerClick(e.survei?.id)}>
                    Lihat Tracker Survei
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

};

export default Dashboard;




