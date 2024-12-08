// "use client";

// import { useEffect, useState } from 'react';
// import styles from './index.module.css';
// import Link from 'next/link';
// import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
// import { useRouter } from 'next/navigation';

// export default function Index() {
//     const [souvenir, setSouvenir] = useState([]);
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredSouvenir, setFilteredSouvenir] = useState([]);
//     const [notifications, setNotifications] = useState('');
//     const router = useRouter();

//     useEffect(() => {
//         async function fetchingData() {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}souvenir/get-list-souvenir?page=${page}`, {
//                     method: 'GET',
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (!res.ok) throw new Error('Network response was not ok');

//                 const listSouvenir = await res.json();
//                 setSouvenir(listSouvenir.results);
//                 setTotalPages(Math.ceil(listSouvenir.count / 10));  // Update total halaman

//                 const restockSouvenirs = listSouvenir.results
//                     .filter(item => item.jumlah_stok < item.jumlah_minimum)
//                     .map(item => item.nama_souvenir)
//                     .join(', ');

//                 if (restockSouvenirs) {
//                     setNotifications(`${restockSouvenirs} perlu di-restock!`);
//                 } else {
//                     setNotifications('');
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch data:", error);
//             }
            

//     }

//     const verifyUser = async () => {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             router.push('/login');
//             return;
//         }
        
//             try {
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_logistik/`, {
//                     headers: { 'Authorization': `Token ${token}` },
//                 });
//                 const data = await response.json();

//                 if (data.error || data.role !== 'Logistik') {
//                     router.push('/login');
//                 }
//             } catch (error) {
//                 console.error('Failed to verify role:', error);
//                 router.push('/login');
//             }
    
// };
//         fetchingData();
//         verifyUser();
//     }, [page], [router]);

//     const closeNotification = () => {
//         setNotifications('');
//     };

//     const HandleDelete = async (id) => {
//         if (confirm("Apakah Anda yakin ingin menghapus souvenir ini?")) {
//             try {
//                 const response = await fetch(
//                     `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/delete-souvenir/${id}/`,
//                     {
//                         method: "DELETE",
//                     }
//                 );
    
//                 if (response.ok) {
//                     setSouvenir((prevSouvenir) => prevSouvenir.map((e) =>
//                         e.id === id ? { ...e, is_deleted: true } : e
//                     ));
//                     setFilteredSouvenir(filteredSouvenir.filter((item) => item.id !== id));
//                 } else {
//                     console.error("Gagal menghapus souvenir");
//                 }
//             } catch (error) {
//                 console.error("Error muncul ketika menghapus souvenir", error);
//             }
//         }
//     };

//     useEffect(() => {
//         const search = () => {
//             let searched = souvenir.filter((element) => !element.is_deleted);
//             if (searchTerm) {
//                 searched = searched.filter((element) => 
//                     (element.nama_souvenir && element.nama_souvenir.toLowerCase().includes(searchTerm.toLowerCase()))
//                 );
//             }
//             setFilteredSouvenir(searched);
//         };
//         search();
//     }, [searchTerm, souvenir]);

//     const handleNextPage = () => {
//         if (page < totalPages) setPage(page + 1);
//     };

//     const handlePreviousPage = () => {
//         if (page > 1) setPage(page - 1);
//     };

//     return (
//         <div> 
//             <b className={styles.headingSouvenir}>Tracker Souvenir</b>

//             {notifications && (
//                 <div className={styles.notification}>
//                     <p>{notifications}</p>
//                     <button onClick={closeNotification} className={styles.closeButton}>X</button>
//                 </div>
//             )}

//             <div className={styles.searchBarContainer}>
//                 <MagnifyingGlassIcon className={styles.iconSearch}/>
//                 <MagnifyingGlassIcon className={styles.iconSearch}/>
//                 <input
//                     className={styles.searchBar}
//                     type='text'
//                     name='search'
//                     placeholder='Cari berdasarkan nama souvenir...'
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>
//             <table className={styles.tableContainerSouvenir}>
//                 <thead>
//                     <tr>
//                         <th>No</th>
//                         <th>No</th>
//                         <th>Nama Souvenir</th>
//                         <th>Jumlah Stok</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredSouvenir.map((element, index) => (
//                         <tr className={styles.trSouvenir} key={element.id}>
//                             <td>{(page - 1) * 10 + index + 1}</td>
//                     {filteredSouvenir.map((element, index) => (
//                         <tr key={element.id}>
//                             <td>{(page - 1) * 10 + index + 1}</td>
//                             <td>{element.nama_souvenir}</td>
//                             <td>{element.jumlah_stok}</td>
//                             <td>
//                                 <Link href={`/souvenir/edit/${element.id}`}>
//                                     <button className={styles.buttonSouvenir}><PencilIcon className={styles.iconSouvenir}/></button>
//                                 </Link>
//                                 <button className={styles.buttonSouvenir} onClick={() => HandleDelete(element.id)}><TrashIcon className={styles.iconSouvenir}/></button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <div>
//                 <button
//                     onClick={handlePreviousPage}
//                     disabled={page === 1}
//                     className={`${page === 1 ? styles['buttonDisabledSebelumnya'] : styles['buttonEnabledSebelumnya']}`}>
//                     <ChevronLeftIcon className={styles.iconChevron} />
//                     Sebelumnya
//                 </button>
//                 <button
//                     onClick={handleNextPage}
//                     disabled={page === totalPages}
//                     className={`${page === totalPages ? styles['buttonDisabledSelanjutnya'] : styles['buttonEnabledSelanjutnya']}`}>
//                     Selanjutnya
//                     <ChevronRightIcon className={styles.iconChevron} />
//                 </button>
//             </div>

//             <Link href="/souvenir/buat-souvenir">
//                 <button className={styles.buttonTambahSouvenir}><PlusIcon className={styles.iconChevron}/>Tambah Souvenir</button>
//                 <button className={styles.buttonTambahSouvenir}><PlusIcon className={styles.iconChevron}/>Tambah Souvenir</button>
//             </Link>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Link from "next/link";
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Index() {
  const [souvenir, setSouvenir] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSouvenir, setFilteredSouvenir] = useState([]);
  const [notifications, setNotifications] = useState("");

  useEffect(() => {
    async function fetchingData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/souvenir/get-list-souvenir?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Network response was not ok");

        const listSouvenir = await res.json();
        setSouvenir(listSouvenir.results);
        setTotalPages(Math.ceil(listSouvenir.count / 10)); // Update total halaman

        const restockSouvenirs = listSouvenir.results
          .filter((item) => item.jumlah_stok < item.jumlah_minimum)
          .map((item) => item.nama_souvenir)
          .join(", ");

        if (restockSouvenirs) {
          setNotifications(`${restockSouvenirs} perlu di-restock!`);
        } else {
          setNotifications("");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchingData();
  }, [page]);

  const closeNotification = () => {
    setNotifications("");
  };

  const HandleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus souvenir ini?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}souvenir/delete-souvenir/${id}/`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSouvenir((prevSouvenir) => prevSouvenir.map((e) => (e.id === id ? { ...e, is_deleted: true } : e)));
          setFilteredSouvenir(filteredSouvenir.filter((item) => item.id !== id));
        } else {
          console.error("Gagal menghapus souvenir");
        }
      } catch (error) {
        console.error("Error muncul ketika menghapus souvenir", error);
      }
    }
  };

  useEffect(() => {
    const search = () => {
      let searched = souvenir.filter((element) => !element.is_deleted);
      if (searchTerm) {
        searched = searched.filter((element) => element.nama_souvenir && element.nama_souvenir.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      setFilteredSouvenir(searched);
    };
    search();
  }, [searchTerm, souvenir]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div>
      <b className={styles.headingSouvenir}>Tracker Souvenir</b>

      {notifications && (
        <div className={styles.notification}>
          <p>{notifications}</p>
          <button onClick={closeNotification} className={styles.closeButton}>
            X
          </button>
        </div>
      )}

      <div className={styles.searchBarContainer}>
        <MagnifyingGlassIcon className={styles.iconSearch} />
        <input className={styles.searchBar} type="text" name="search" placeholder="Cari berdasarkan nama souvenir..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <table className={styles.tableContainerSouvenir}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Souvenir</th>
            <th>Jumlah Stok</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSouvenir.map((element, index) => (
            <tr key={element.id}>
              <td>{(page - 1) * 10 + index + 1}</td>
              <td>{element.nama_souvenir}</td>
              <td>{element.jumlah_stok}</td>
              <td>
                <Link href={`/souvenir/edit/${element.id}`}>
                  <button className={styles.buttonSouvenir}>
                    <PencilIcon className={styles.iconSouvenir} />
                  </button>
                </Link>
                <button className={styles.buttonSouvenir} onClick={() => HandleDelete(element.id)}>
                  <TrashIcon className={styles.iconSouvenir} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={handlePreviousPage} disabled={page === 1} className={`${page === 1 ? styles["buttonDisabledSebelumnya"] : styles["buttonEnabledSebelumnya"]}`}>
          <ChevronLeftIcon className={styles.iconChevron} />
          Sebelumnya
        </button>
        <button onClick={handleNextPage} disabled={page === totalPages} className={`${page === totalPages ? styles["buttonDisabledSelanjutnya"] : styles["buttonEnabledSelanjutnya"]}`}>
          Selanjutnya
          <ChevronRightIcon className={styles.iconChevron} />
        </button>
      </div>

      <Link href="/souvenir/buat-souvenir">
        <button className={styles.buttonTambahSouvenir}>
          <PlusIcon className={styles.iconChevron} />
          Tambah Souvenir
        </button>
      </Link>
    </div>
  );
}
