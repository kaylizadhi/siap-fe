import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';

export default function Index() {
    const [survei, setSurvei] = useState([]);
    const [page, setPage] = useState(1); // Track the current page
    const [totalCount, setTotalCount] = useState(0); // Track the total count

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
                    // No need to check for result.success if you are removing it from state directly
                    setSurvei((prevSurvei) => prevSurvei.filter((e) => e.id !== id));
                } else {
                    console.error("Failed to delete the survey");
                }
            } catch (error) {
                console.error("An error occurred while deleting the survey", error);
            }
        }
    };

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
        <div className={styles.manajemenDataKlien}>
            <b className={styles.daftarKlien}>Daftar Survei</b>
            {/* Navigation Bar omitted for brevity */}

            <input
                className={styles.searchBar}
                type='text'
                name='daftarsurvei'
                placeholder='Cari survei...'
            />

            <div className={styles.frameGroup}>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-3 px-4 border-b">Judul Survei</th>
                                <th className="py-3 px-4 border-b">Nama Klien</th>
                                <th className="py-3 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {survei.map((element) => (
                                <tr key={element.id} className={styles.table}>
                                    <td className={styles.table}>{element.nama_survei}</td>
                                    <td className={styles.table}>{element.nama_klien}</td>
                                    <td className={styles.table}>
                                        <Link href={`/survei/edit/${element.id}`}>
                                            <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                        </Link>
                                        <button onClick={() => HandleDelete(element.id)} className="text-red-500 hover:underline mr-2">Delete</button>
                                        <Link href={`/survei/${element.id}`}>
                                            <button className="text-green-500 hover:underline">View</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`text-gray-500 ${page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    Sebelumnya
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={survei.length === 0}
                    className={`text-gray-500 ${survei.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    Selanjutnya
                </button>
            </div>

            <Link href="/survei/buat-survei">
                <button className={styles.dashboardButton2}>Tambah Survei</button>
            </Link>
        </div>
    );
}
