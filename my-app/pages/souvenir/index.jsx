import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Index() {
    const [souvenir, setSouvenir] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSouvenir, setFilteredSouvenir] = useState([]);
    const [notifications, setNotifications] = useState('');
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedSouvenirs = souvenir.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        async function fetchingData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}souvenir/get-list-souvenir?page=${page}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error('Network response was not ok');

                const listSouvenir = await res.json();
                setSouvenir(listSouvenir.results);

                // Gabungkan pesan notifikasi untuk souvenir yang perlu di-restock
                const restockSouvenirs = listSouvenir.results
                    .filter(item => item.jumlah_stok < item.jumlah_minimum)
                    .map(item => item.nama_souvenir)
                    .join(', ');  // Menggabungkan nama souvenir yang perlu direstock

                if (restockSouvenirs) {
                    setNotifications(`${restockSouvenirs} perlu direstock!`);
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
        if (confirm("Apakah Anda yakin ingin menghapus souvenir ini?")) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}souvenir/delete-souvenir/${id}/`,
                    {
                        method: "DELETE",
                    }
                );

                if (response.ok) {
                    setSouvenir((prevSouvenir) => prevSouvenir.filter((e) => e.id !== id));
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
            let searched = souvenir;
            if (searchTerm) {
                searched = searched.filter((element) => 
                    (element.nama_souvenir && element.nama_souvenir.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            setFilteredSouvenir(searched);
        };
        search();
    }, [searchTerm, souvenir]);

    const handleNextPage = () => {
        if (paginatedSouvenirs.length === itemsPerPage) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div> 
            <b className={styles.headingSouvenir}>Tracker Souvenir</b>

            {/* Notifikasi per item */}
            {notifications && (
                <div className={styles.notification}>
                    <p>{notifications}</p>
                    <button onClick={closeNotification} className={styles.closeButton}>X</button>
                </div>
            )}

            <div className={styles.searchBarContainer}>
                <input
                    className={styles.searchBar}
                    type='text'
                    name='search'
                    placeholder='Cari berdasarkan nama souvenir...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className={styles.tableContainerSouvenir}>
                <thead>
                    <tr>
                        <th>Nama Souvenir</th>
                        <th>Jumlah Stok</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSouvenir.map((element) => (
                        <tr className={styles.trSouvenir} key={element.id}>
                            <td>{element.nama_souvenir}</td>
                            <td>{element.jumlah_stok}</td>
                            <td>
                                <Link href={`/souvenir/edit/${element.id}`}>
                                    <button className={styles.buttonSouvenir}><PencilIcon className={styles.iconSouvenir}/></button>
                                </Link>
                                <button className={styles.buttonSouvenir} onClick={() => HandleDelete(element.id)}><TrashIcon className={styles.iconSouvenir}/></button>
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
                    disabled={paginatedSouvenirs.length < itemsPerPage}
                    className={`${paginatedSouvenirs.length < itemsPerPage ? styles['buttonDisabledSelanjutnya'] : styles['buttonEnabledSelanjutnya']}`}>
                    Selanjutnya
                    <ChevronRightIcon className={styles.iconChevron} />
                </button>
            </div>

            <Link href="/souvenir/buat-souvenir">
                <button className={styles.buttonTambahSouvenir}><PlusIcon className={styles.iconSouvenir1}/>Tambah Souvenir</button>
            </Link>
        </div>
    );
}
