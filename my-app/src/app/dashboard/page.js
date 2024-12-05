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
          `${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_dashboard/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data = await response.json();

        if (
          data.role === "Admin Sistem"
        ) {
          router.push("/buat-akun");
        } else if (
          data.role === "Pengendali Mutu"
        ) {
          router.push("/tracker-survei");
        } else if (
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei-status/dashboard/`, {
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

// const getLastValidStatus = (statusList) => {
//   const validStatuses = [];

//   for (const statusObj of statusList) {
//     const key = Object.keys(statusObj)[0];
//     const value = statusObj[key];

//     if (value === "NOT_STARTED") break;
//     validStatuses.push({ key, value });
//   }

//   if (validStatuses.length === 0) {
//     const lastFinished = statusList.reverse().find(
//       (statusObj) => Object.values(statusObj)[0] === "FINISHED"
//     );
//     if (lastFinished) {
//       const key = Object.keys(lastFinished)[0];
//       const value = lastFinished[key];
//       return `${key}: ${value}`;
//     }
//   }

//   const lastValid = validStatuses[validStatuses.length - 1];
//   return `${lastValid.key}: ${lastValid.value}`;
// };

// const getLastValidStatus = (statusList) => {
//   const validStatuses = [];

//   // Loop through tracker statuses to find the valid status
//   for (const statusObj of statusList) {
//     const key = Object.keys(statusObj)[0];
//     const value = statusObj[key];

//     if (value === "NOT_STARTED") break;
//     validStatuses.push({ key, value });
//   }

//   if (validStatuses.length === 0) {
//     const lastFinished = statusList.reverse().find(
//       (statusObj) => Object.values(statusObj)[0] === "FINISHED"
//     );
//     if (lastFinished) {
//       const key = Object.keys(lastFinished)[0];
//       const value = lastFinished[key];
//       return `${key}: ${value}`;
//     }
//   }

//   const lastValid = validStatuses[validStatuses.length - 1];
//   return `${lastValid.key}: ${lastValid.value}`;
// };



//   return (
//     <div className={styles.containerBackground}>
//       <div className={styles.container}>
//         <div className={styles.content}>
//           <h1 className={styles.title}>Dashboard Progres Survei</h1>

//           <div className={styles.surveyTypeSection}>
//             <label className={styles.label}>Pilih Jenis Survei</label>
//             <div className={styles.radioGroup}>
//               {["keseluruhan", "nasional", "provinsi", "kota"].map((type) => (
//                 <React.Fragment key={type}>
//                   <input
//                     type="radio"
//                     id={type}
//                     name="surveyType"
//                     value={type}
//                     checked={surveyType === type}
//                     onChange={handleSurveyTypeChange}
//                   />
//                   <label htmlFor={type}>Survei {type}</label>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>

//           <div className={styles.tableContainer}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Nama Klien</th>
//                   <th>Judul Survei</th>
//                   <th>Tanggal Mulai</th>
//                   <th>Tanggal Berakhir</th>
//                   <th>Wilayah</th>
//                   <th>Jumlah Responden</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {survei.map((survei, index) => (
//                   <tr key={survei.id}>
//                     <td>
//                       <img
//                         src="/images/Profile.svg"
//                         alt="User Icon"
//                         className={styles.icon}
//                       />{" "}
//                       {survei.nama_klien}
//                     </td>
//                     <td>{survei?.nama_survei}</td>
//                     <td>
//                       {survei?.waktu_mulai_survei &&
//                         formatDateTime(survei?.waktu_mulai_survei)}
//                     </td>
//                     <td>
//                       {survei?.waktu_berakhir_survei &&
//                         formatDateTime(survei?.waktu_berakhir_survei)}
//                     </td>
//                     <td>{survei?.wilayah_survei}</td>
//                     <td>{survei?.jumlah_responden}</td>
//                     <td>
//                       {/* {Array.isArray(survei.tracker)
//                         ? getLastValidStatus(survei.tracker)
//                         : "Tidak ada data"} */}
//                         {survei?.tracker ? 
//                         getLastValidStatus(Object.values(survei.tracker)) : 
//                         "Tidak ada data"}
//                     </td>
//                     <td className={styles.actions}>
//                     <button
//                         className={styles.actionButton}
//                         onClick={() => handleSeeDetailSurveyClick(survei?.id)}
//                       >
//                         Lihat Detail Survei
//                       </button>
          
//                       <button
//                         className={styles.actionButton}
//                         onClick={() => handleSeeTrackerClick(survei?.id)}
//                       >
//                         Lihat Tracker Survei
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

// };

// export default Dashboard;


// const getLastValidStatus = (statusList) => {
//   const validStatuses = [];

//   for (const statusObj of statusList) {
//     const key = Object.keys(statusObj)[0];
//     const value = statusObj[key];

//     if (value === "NOT_STARTED") break;
//     validStatuses.push({ key, value });
//   }

//   if (validStatuses.length === 0) {
//     const lastFinished = statusList.reverse().find(
//       (statusObj) => Object.values(statusObj)[0] === "FINISHED"
//     );
//     if (lastFinished) {
//       const key = Object.keys(lastFinished)[0];
//       const value = lastFinished[key];
//       return `${key}: ${value}`;
//     }
//   }

//   const lastValid = validStatuses[validStatuses.length - 1];
//   return `${lastValid.key}: ${lastValid.value}`;
// };

// const getLastValidStatus = (statusList) => {
//   if (!statusList || statusList.length === 0) {
//     return "Status data tidak tersedia";
//   }

//   const validStatuses = Object.entries(statusList[0])
//     .filter(([key, value]) => value !== "NOT_STARTED")
//     .map(([key, value]) => ({ key, value }));

//   if (validStatuses.length ===