"use client";

import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Index() {
    const [survei, setSurvei] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSurvei, setFilteredSurvei] = useState([]);
    const [notifications, setNotifications] = useState('');

    useEffect(() => {
        async function fetchingData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/get-list-survei?page=${page}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error('Network response was not ok');

                const listSurvei = await res.json();
                setSurvei(listSurvei.results);
                setTotalPages(Math.ceil(listSurvei.count / 10));  // Update total halaman

                const restockSurvei = listSurvei.results
                    .filter(item => item.jumlah_stok < item.jumlah_minimum)
                    .map(item => item.nama_survei)
                    .join(', ');

                if (restockSurvei) {
                    setNotifications(`${restockSurvei} perlu di-restock!`);
                } else {
                    setNotifications('');
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchingData();
    }, [page]);

    const closeNotification = () => {
        setNotifications('');
    };

    const HandleDelete = async (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus survei ini?")) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}survei/delete-survei/${id}/`,
                    {
                        method: "DELETE",
                    }
                );
    
                if (response.ok) {
                    setSurvei((prevSurvei) => prevSurvei.map((e) =>
                        e.id === id ? { ...e, is_deleted: true } : e
                    ));
                    setFilteredSurvei(filteredSurvei.filter((item) => item.id !== id));
                } else {
                    console.error("Gagal menghapus survei");
                }
            } catch (error) {
                console.error("Error muncul ketika menghapus survei", error);
            }
        }
    };

    useEffect(() => {
        const search = () => {
            let searched = survei.filter((element) => !element.is_deleted);
            if (searchTerm) {
                searched = searched.filter((element) => 
                    (element.nama_survei && element.nama_survei.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            setFilteredSurvei(searched);
        };
        search();
    }, [searchTerm, survei]);

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div> 
            <b className={styles.headingSurvei}>Daftar Survei</b>

            <div className={styles.searchBarContainer}>
                <MagnifyingGlassIcon className={styles.iconSearch}/>
                <input
                    className={styles.searchBar}
                    type='text'
                    name='search'
                    placeholder='Cari berdasarkan nama survei atau klien...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className={styles.tableContainerSurvei}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Survei</th>
                        <th>Nama Klien</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSurvei.map((element, index) => (
                        <tr key={element.id}>
                            <td>{(page - 1) * 10 + index + 1}</td>
                            <td>{element.nama_survei}</td>
                            <td>{element.jumlah_stok}</td>
                            <td>
                                <Link href={`/survei/edit/${element.id}`}>
                                    <button className={styles.buttonSurvei}><PencilIcon className={styles.iconSurvei}/></button>
                                </Link>
                                <button className={styles.buttonSurvei} onClick={() => HandleDelete(element.id)}><TrashIcon className={styles.iconSurvei}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`${page === 1 ? styles['buttonDisabledSebelumnya'] : styles['buttonEnabledSebelumnya']}`}>
                    <ChevronLeftIcon className={styles.iconChevron} />
                    Sebelumnya
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className={`${page === totalPages ? styles['buttonDisabledSelanjutnya'] : styles['buttonEnabledSelanjutnya']}`}>
                    Selanjutnya
                    <ChevronRightIcon className={styles.iconChevron} />
                </button>
            </div>

            <Link href="/survei/buat-survei">
                <button className={styles.buttonTambahSurvei}><PlusIcon className={styles.iconChevron}/>Tambah Survei</button>
            </Link>
        </div>
    );
}
