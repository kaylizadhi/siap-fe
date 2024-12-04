"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/dashboard.module.css"; 
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0); 
  const [page, setPage] = useState(1);
  const [surveyType, setSurveyType] = useState("");
  const [survei, setSurvei] = useState([]);
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
  // useEffect(() => {
    // const verifyUser = async () => {
    //   const token = localStorage.getItem("authToken");
    //   if (!token) {
    //     router.push("/login");
    //     return;
    //   }

    //   try {
    //     const response = await fetch(
    //       "http://localhost:8000/accounts/check_role/",
    //       {
    //         headers: { Authorization: `Token ${token}` },
    //       }
    //     );
    //     const data = await response.json();

    //     if (
    //       data.error ||
    //       !["Administrasi", "Eksekutif", "Logistik"].includes(data.role)
    //     ) {
    //       router.push("/login");
    //     }
    //   } catch (error) {
    //     console.error("Failed to verify role:", error);
    //     router.push("/login");
    //   }
    // };

    // verifyUser();
  // }, [router]);

  const handleSurveyTypeChange = (e) => {
    const selectedSurveyType = e.target.value;
    setSurveyType(selectedSurveyType);

    if (selectedSurveyType === "nasional") {
      router.push("/dashboard/nasional");
    } else if (selectedSurveyType === "provinsi") {
      router.push("/dashboard/provinsi");
    } else if (selectedSurveyType === "kota") {
      router.push("/dashboard/kota");
    }
  };

  const handleSeeDetailClick = (index) => {
    const router = useRouter();

    // Get survey ID from index
    const surveyId = getSurveyIdByIndex(index);

    if (surveyId) {
        // Navigate to the detail page
        router.push(`/survei/get-survei-detail/${surveyId}`);
    } else {
        console.error("Survey ID not found for index:", index);
    }
};


  const getSurveyIdByIndex = (index) => {
    if (index >= 0 && index < surveyData.length) {
        return surveyData[index].id; 
    } else {
        console.error("Invalid index:", index);
        return null;
    }
  };


// const handleSeeDetailSurvey = (e) => {
//   const selectedDetailPage = e.target.value;
//   setDetailPage(selectedDetailPage);

//   if (selectedDetailPage === "DetailSurvei") {
//     router.push("/survei/get-detail-survei");
//   } 
// };

useEffect(() => {
  async function fetchingData() {
      try {
          const res = await fetch(`http://127.0.0.1:8000/api/survei-status/dashboard`, {
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
}, [page]);
// const fetchSurvey = async () => {
//   const router = useRouter();

//   try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/get-list-survei?page=${page}`, {
//           method: 'GET', 
//           headers: {
//             "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//           throw new Error('Failed to fetch survey details');
//       }

//       // Navigate to the survey detail page
//       router.push(`/survei/get-survei-detail/${surveyId}`);
//   } catch (error) {
//       console.error('Error fetching survey details:', error);
//   }
//   fetchSurvey();
// };
const getLastValidStatus = (statusList) => {
  const validStatuses = [];

  for (const statusObj of statusList) {
    const key = Object.keys(statusObj)[0]; // Ambil kunci status (misal: "buat_kontrak")
    const value = statusObj[key]; // Ambil nilai status (misal: "FINISHED")

    if (value === "NOT_STARTED") break; // Hentikan jika ketemu "NOT_STARTED"
    validStatuses.push({ key, value });
  }

  // Jika validStatuses kosong, tampilkan status terakhir yang "FINISHED"
  if (validStatuses.length === 0) {
    const lastFinished = statusList.reverse().find(
      (statusObj) => Object.values(statusObj)[0] === "FINISHED"
    );
    if (lastFinished) {
      const key = Object.keys(lastFinished)[0];
      const value = lastFinished[key];
      return `${key}: ${value}`;
    }
  }

  // Tampilkan status terakhir dari validStatuses
  const lastValid = validStatuses[validStatuses.length - 1];
  return `${lastValid.key}: ${lastValid.value}`;
};

  return (
    <div className={styles.containerBackground}>
      <div className={styles.content}>
        <h1 className={styles.title}>Dashboard Survei</h1>

        <div className={styles.surveyTypeSection}>
          <label className={styles.label}>Pilih Jenis Survei</label>
          <div className={styles.radioGroup}>
            <input
              type="radio"
              id="nasional"
              name="surveyType"
              value="nasional"
              checked={surveyType === "nasional"}
              onChange={handleSurveyTypeChange}
            />
            <label htmlFor="nasional">Survei Nasional</label>
            <input
              type="radio"
              id="provinsi"
              name="surveyType"
              value="provinsi"
              checked={surveyType === "provinsi"}
              onChange={handleSurveyTypeChange}
            />
            <label htmlFor="provinsi">Survei Provinsi</label>
            <input
              type="radio"
              id="kota"
              name="surveyType"
              value="kota"
              checked={surveyType === "kota"}
              onChange={handleSurveyTypeChange}
            />
            <label htmlFor="kota">Survei Kota</label>
          </div>
        </div>

        {/* Placeholder Diagram */}
        <div className={styles.diagramPlaceholder}>Diagram Placeholder</div>

        {/* Tabel Data */}
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
                      <tr key={e.survei?.id}>
                          <td><img src="/images/Profile.svg" alt="User Icon" className={styles.icon} /> {e.survei?.nama_klien}</td>
                          <td>{e.survei?.nama_survei}</td>
                          <td>{e.survei?.waktu_mulai_survei && formatDateTime(e.survei?.waktu_mulai_survei)}</td>
                          <td>{e.survei?.waktu_berakhir_survei && formatDateTime(e.survei?.waktu_berakhir_survei)}</td>
                          <td>{e.survei?.wilayah_survei}</td>
                          <td>{e.survei?.jumlah_responden}</td>
                          <td>
                            {Array.isArray(e.status) ? getLastValidStatus(e.status) : "Tidak ada data"}
                          </td>
                          <td className={styles.actions}>
                            <Link href={`/survei/${e.survei?.id}`}>
                              <button className={styles.detailButton}>
                                <img src="/images/Detail.svg" alt="Detail" />
                              </button>
                            </Link>
                            <Link href={`/tracker-survei/${e.survei?.id}`}>
                            <button 
                              className={styles.deleteButton} 
                              onClick={() => handleDeleteClick(e.survei?.id)}
                            >
                              <img src="/images/Delete.svg" alt="Delete" />
                            </button>
                            </Link>
                          </td>

                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;