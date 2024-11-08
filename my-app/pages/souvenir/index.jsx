import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Index() {
    const [souvenir, setSouvenir] = useState([]);
    const [page, setPage] = useState(1); // Track the current page
    const [totalCount, setTotalCount] = useState(0); // Track the total count
    const [searchTerm, setSearchTerm] = useState('');  // Single search term
    const [filteredSouvenir, setFilteredSouvenir] = useState([]);

    useEffect(() => {
        async function fetchingData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}souvenir/get-list-souvenir?page=${page}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const listSouvenir = await res.json();
                setSouvenir(listSouvenir.results);
                setTotalCount(listSouvenir.count);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchingData();
    }, [page]);

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
        }
        search();
    }, [searchTerm, souvenir]);

    const handleNextPage = () => {
        if (souvenir.length > 0) {
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
            <b className={styles.headingSouvenir}>Tracker Souvenir</b>
            {/* Navigation Bar omitted for brevity */}
            <div className={styles.searchBarContainer}>
                <MagnifyingGlassIcon className={styles.iconSearch} />
                <input
                    className={styles.searchBar}
                    type='text'
                    name='search'
                    placeholder='Cari berdasarkan nama souvenir...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
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
                <tbody className={styles.tdSouvenir}>
                    {filteredSouvenir.map((element) => (
                        <tr key={element.id}>
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
                    className={`${page === 1 ? styles['buttonDisabledSebelumnya'] : styles['buttonEnabledSebelumya']}`}>
                    <ChevronLeftIcon className={styles.iconChevron} />
                    Sebelumnya
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={souvenir.length === 0}
                    className={`${souvenir.length === 0 ? styles['buttonDisabledSelanjutnya'] : styles['buttonEnabledSelanjutnya']}`}>
                    Selanjutnya
                    <ChevronRightIcon className={styles.iconChevron} />
                </button>
            </div>

            <Link href="/souvenir/buat-souvenir">
                <button className={styles.buttonTambahSouvenir}><PlusIcon className={styles.iconSouvenir}/>Tambah Souvenir</button>
            </Link>
        </div>
    );
}