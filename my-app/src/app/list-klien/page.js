"use client"

import { useEffect, useState } from 'react';
import { Caudex } from 'next/font/google';

const caudex = Caudex({ weight: '700', subsets: ['latin'] });

export default function DaftarKlien() {
    const [kliens, setKliens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        // Fetch the clients from the Django API
        const fetchKliens = async () => {
            try {
                const response = await fetch('http://localhost:8000/klien/'); // Update with your actual API URL
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setKliens(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchKliens();
    }, []);

    // Filter clients based on search query
    const filteredKliens = kliens.filter(klien =>
        klien.nama_klien.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1 className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}>
                Daftar Klien
            </h1>
            <div className="w-full flex px-4 py-3 mb-3 rounded-md border-2 border overflow-hidden mx-auto font-[sans-serif]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                    className="fill-gray-600 mr-3 rotate-90">
                    <path
                        d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                    </path>
                </svg>
                <input 
                    type="text" 
                    placeholder="Cari Klien" 
                    className="w-full outline-none bg-transparent text-gray-600 text-sm" 
                    value={searchQuery} // Bind input value to searchQuery state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                />
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase">Select</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase">Nama Klien</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase">Nama Perusahaan</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase">Daerah</th>
                        <th className="px-6 py-3 text-xs text-gray-500 uppercase">Harga Survei</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKliens.map((klien) => (
                        <tr key={klien.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td>
                                <div className="flex items-center pl-2 py-4">
                                    <input id={`checkbox-${klien.id}`} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-bold text-gray-700">{klien.nama_klien}</p>
                            </td>
                            <td className="px-6 py-4">{klien.nama_perusahaan}</td>
                            <td className="px-6 py-4">{klien.daerah}</td>
                            <td className="px-6 py-4">{klien.harga_survei}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
