"use client"

import { useState } from 'react';
import { Caudex } from 'next/font/google';

const caudex = Caudex({ weight: '700', subsets: ['latin'] });

export default function DaftarKlien() {
    const [formData, setFormData] = useState({
        nama_klien: '',
        nama_perusahaan: '',
        daerah: '',
        harga_survei: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/klien/create/', {  // Ganti dengan URL API yang sesuai
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSuccess('Klien berhasil ditambahkan!');
            setError(null);
            setFormData({
                nama_klien: '',
                nama_perusahaan: '',
                daerah: '',
                harga_survei: ''
            });
        } catch (error) {
            setError('Gagal menambahkan klien.');
            setSuccess(null);
        }
    };

    return (
        <div>
            <div>
                <h1 className={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}>
                    Daftar Klien
                </h1>

                {success && <div className="mb-4 text-green-500">{success}</div>}
                {error && <div className="mb-4 text-red-500">{error}</div>}

                <form onSubmit={handleSubmit} className="mb-6">
                    <input
                        type="text"
                        name="nama_klien"
                        placeholder="Nama Klien"
                        value={formData.nama_klien}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 mb-4 w-full"
                        required
                    />
                    <input
                        type="text"
                        name="nama_perusahaan"
                        placeholder="Nama Perusahaan"
                        value={formData.nama_perusahaan}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 mb-4 w-full"
                        required
                    />
                    <input
                        type="text"
                        name="daerah"
                        placeholder="Daerah"
                        value={formData.daerah}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 mb-4 w-full"
                        required
                    />
                    <input
                        type="number"
                        name="harga_survei"
                        placeholder="Harga Survei"
                        value={formData.harga_survei}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 mb-4 w-full"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">
                        Tambah Klien
                    </button>
                </form>

                <div className="w-full flex px-4 py-3 mb-3 rounded-md border-2 border overflow-hidden mx-auto font-[sans-serif]">
                    <input type="text" placeholder="Cari Klien" className="w-full outline-none bg-transparent text-gray-600 text-sm" />
                </div>
                {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td>
                                <div className="flex items-center pl-2 py-4">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        value=""
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            </td>
                            <td scope="row" className="px-6 py-4">
                                <p className="font-bold text-gray-700">Jane Doe</p>
                                <p className="text-medium ">Senior Designer</p>
                            </td>
                            <td className="px-6 py-4">
                                Cell Text=
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">Badges</span>
                            </td>
                            <td className="pl-6 py-4">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#A52525">
                                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                                </svg>
                            </td>
                            <td className="pr-6 py-4">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#A52525">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table> */}
            </div>
        </div>
    );
}
