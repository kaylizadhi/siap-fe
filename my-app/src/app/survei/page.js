"use client";

import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Diplomata } from 'next/font/google';

export default function Index() {
    const [survei, setSurvei] = useState([]);
    const [page, setPage] = useState(1); // Track the current page
    const [totalCount, setTotalCount] = useState(0); // Track the total count
    const [searchTerm, setSearchTerm] = useState('');  // Single search term
    const [filteredSurvei, setFilteredSurvei] = useState([]);

    useEffect(() => {
        async function fetchingData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}survei/get-list-survei?page=${page}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const listSurvei = await res.json();
                setSurvei(listSurvei.results);
                setTotalCount(listSurvei.count);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchingData();
    }, [page]);

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
                    setSurvei((prevSurvei) => prevSurvei.filter((e) => e.id !== id));
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
            let searched = survei;
            if (searchTerm) {
                searched = searched.filter((element) => 
                    (element.nama_survei && element.nama_survei.toLowerCase().includes(searchTerm.toLowerCase())) || 
                    (element.nama_klien && element.nama_klien.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            setFilteredSurvei(searched);
        }
        search();
    }, [searchTerm, survei]);

    const handleNextPage = () => {
        if (survei.length > 0) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div>
            <b className={styles.headingSurvei}>Daftar Survei</b>
            {/* Navigation Bar omitted for brevity */}
            <div className={styles.searchBarContainer}>
                <MagnifyingGlassIcon className={styles.iconSearch} />
                <input
                    className={styles.searchBar}
                    type='text'
                    name='search'
                    placeholder='Cari berdasarkan judul survei atau nama klien...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
                />
            </div>
            <table className={styles.tableContainerSurvei}>
                <thead>
                    <tr>
                        <th>Judul Survei</th>
                        <th>Nama Klien</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className={styles.tdSurvei}>
                    {filteredSurvei.map((element) => (
                        <tr key={element.id}>
                            <td>{element.nama_survei}</td>
                            <td>{element.nama_klien}</td>
                            <td>
                                <Link href={`/survei/edit/${element.id}`}>
                                    <button className={styles.buttonSurvei}><PencilIcon className={styles.iconSurvei}/></button>
                                </Link>
                                    <button className={styles.buttonSurvei} onClick={() => HandleDelete(element.id)}><TrashIcon className={styles.iconSurvei}/></button>
                                <Link href={`/survei/${element.id}`}>
                                    <button className={styles.buttonSurvei}><EyeIcon className={styles.iconSurvei}/></button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`${page === 1 ? styles['buttonDisabledSebelumnya'] : styles['buttonEnabledSebelumya']}`}>
                    <ChevronLeftIcon className={styles.iconChevron} />
                    Sebelumnya
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={survei.length === 0}
                    className={`${survei.length === 0 ? styles['buttonDisabledSelanjutnya'] : styles['buttonEnabledSelanjutnya']}`}>
                    Selanjutnya
                    <ChevronRightIcon className={styles.iconChevron} />
                </button>
            </div>

            <Link href="/survei/buat-survei">
                <button className={styles.buttonTambahSurvei}><PlusIcon className={styles.iconSurvei}/>Tambah Survei</button>
            </Link>
        </div>
    );
}