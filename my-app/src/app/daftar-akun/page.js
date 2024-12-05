"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/daftar-akun.module.css';

export default function DaftarAkun() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [accounts, setAccounts] = useState([]);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentAccountIndex, setCurrentAccountIndex] = useState(null);

    // Fetch account data from backend
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const url = searchQuery
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}daftarAkun/api/searchAkun/?q=${encodeURIComponent(searchQuery)}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}daftarAkun/api/daftarAkun/`;
                const response = await fetch(url);
                const data = await response.json();
                console.log("Fetched accounts:", data);
                setAccounts(data);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        }
    

        const verifyUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }
            
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}accounts/check_role_admin/`, {
                        headers: { 'Authorization': `Token ${token}` },
                    });
                    const data = await response.json();
    
                    if (data.error || data.role !== 'Admin Sistem') {
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Failed to verify role:', error);
                    router.push('/login');
                }
        
    };
    fetchAccounts();
    verifyUser();
}, [searchQuery], [router]);


        
            

    const handleDeleteClick = (index) => {
        setCurrentAccountIndex(index);
        setShowDeleteModal(true);
    };

    // Filter accounts based on search query
    const filteredAccounts = accounts.filter(account =>
        account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${account.first_name} ${account.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastAccount = currentPage * accountsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
    const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (index, accountId) => {
        const accountIndex = index + indexOfFirstAccount;
        setDeletingIndex(accountIndex);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}daftarAkun/${accountId}/delete/`, {
                method: 'DELETE',
                
            });
            setShowDeleteModal(false);
            console.log("account deleted");
            const updatedAccounts = accounts.filter((_, i) => i !== accountIndex);
            setAccounts(updatedAccounts);
        } catch (error) {
            console.error("Error deleting account:", error);
        } finally {
            setDeletingIndex(null);
        }
    };

    return (
        <div className={styles.mainContainer}>
            {/* Main Account List Content */}
            <div className={styles.container}>
                <h1 className={`text-4xl font-weight-700 text-primary-900`}>Daftar Akun</h1>

                <div className="w-full flex px-6 py-3 mb-6 rounded-full border-2 border overflow-hidden mx-auto">
                    <input
                        type="text"
                        placeholder="Cari akun..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className={'w-full outline-none bg-transparent text-gray-600 text-sm'}
                    />
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr className={styles.header}>
                            <th>Username</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAccounts.map((account, index) => (
                            <tr
                                key={account.id}
                                className={index + indexOfFirstAccount === deletingIndex ? styles.fadeOut : ""}
                            >
                                <td><img src="/images/Profile.svg" alt="User Icon" className={styles.icon} /> {account.username}</td>
                                <td>{account.first_name} {account.last_name}</td>
                                <td>{account.email}</td>
                                <td>{account.role}</td>
                                <td className={styles.actions}>
                                    <button 
                                        className={styles.deleteButton} 
                                        onClick={() => handleDeleteClick(index)}
                                    >
                                        <img src="/images/Delete.svg" alt="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    {currentPage > 1 && (
                        <button onClick={() => setCurrentPage(currentPage - 1)}>
                            &lt; Kembali
                        </button>
                    )}
                    {currentPage < totalPages && (
                        <button onClick={() => setCurrentPage(currentPage + 1)}>
                            Selanjutnya &gt;
                        </button>
                    )}
                </div>
            </div>
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p>Apakah Anda yakin ingin menghapus akun ini?</p>
                        <button onClick={() => handleDelete(currentAccountIndex, accounts[currentAccountIndex].id)} className={styles.confirmButton}>Ya</button>
                        <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>Tidak</button>
                    </div>
                </div>
            )}
        </div>
    );
}
