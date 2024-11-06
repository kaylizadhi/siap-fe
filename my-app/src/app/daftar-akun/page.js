"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/daftar-akun.module.css';

export default function DaftarAkun() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [accounts, setAccounts] = useState(
        Array(10).fill({ // data di sini harus disambungin sama akun yg udah dibuat
            username: "JaneDoe123",
            name: "Jane Doe",
            email: "janedoe@gmail.com",
            roles: "Eksekutif"
        }) 
    ); 
    const [deletingIndex, setDeletingIndex] = useState(null);

    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastAccount = currentPage * accountsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
    const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = (index) => {
        const accountIndex = index + indexOfFirstAccount;
        setDeletingIndex(accountIndex);
        setTimeout(() => {
            const updatedAccounts = accounts.filter((_, i) => i !== accountIndex);
            setAccounts(updatedAccounts);
            setDeletingIndex(null);
        }, 500);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/login');
    };

    return (
        <div className={styles.mainContainer}>
            {/* Sidebar */}
            {/* <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <img src="/images/siap-logo-2.svg" alt="siap-logo-2" />
                </div>
                <nav className={styles.nav}>
                    <a href="/dashboard">
                        <img src="/images/Home.svg" alt="Dashboard Icon" className={styles.icon} />Dashboard
                    </a>
                    <a href="/profil">
                        <img src="/images/Profile.svg" alt="Profile Icon" className={styles.icon} />Profil
                    </a>
                    <a href="/create-account">
                        <img src="/images/Add.svg" alt="Create Icon" className={styles.icon} />Buat Akun
                    </a>
                    <a href="/generator-dokumen/invoice-final" className={styles.active}>
                        <img src="/images/CreateRed.svg" alt="Buat Dokumen Icon" className={styles.icon} />Buat Dokumen
                    </a>
                    <a href="/documents">
                        <img src="/images/Document.svg" alt="Daftar Dokumen Icon" className={styles.icon} />Daftar Dokumen
                    </a>
                    <a href="/souvenir-tracker">
                        <img src="/images/Inventory.svg" alt="Tracker Souvenir Icon" className={styles.icon} />Tracker Souvenir
                    </a>
                    <a href="/survey-tracker">
                        <img src="/images/Status.svg" alt="Tracker Status Icon" className={styles.icon} />Tracker Status Survei
                    </a>
                    <a href="/clients">
                        <img src="/images/Client.svg" alt="Daftar Klien Icon" className={styles.icon} />Daftar Klien
                    </a>
                    <a href="/surveys">
                        <img src="/images/Survey.svg" alt="Daftar Survey Icon" className={styles.icon} />Daftar Survei
                    </a>
                </nav>
                <a href="/login" onClick={handleLogout} className={styles.logout}>
                    <img src="/images/Out.svg" alt="Logout Icon" className={styles.icon} />Logout
                </a>
            </aside> */}

            {/* Main Account List Content */}
            <div className={styles.container}>
                <h1 className={styles.title}>Daftar Akun</h1>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Cari akun..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className={styles.searchInput}
                    />
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
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
                                key={index}
                                className={index + indexOfFirstAccount === deletingIndex ? styles.fadeOut : ""}
                            >
                                <td><img src="/images/Profile.svg" alt="User Icon" className={styles.icon} /> {account.username}</td>
                                <td>{account.name}</td>
                                <td>{account.email}</td>
                                <td>{account.roles}</td>
                                <td className={styles.actions}>
                                    <button 
                                        className={styles.deleteButton} 
                                        onClick={() => handleDelete(index)}
                                    >
                                        <img src="/images/Delete.svg" alt="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    {currentPage < totalPages && (
                        <button onClick={goToNextPage}>
                            Selanjutnya &gt;
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
