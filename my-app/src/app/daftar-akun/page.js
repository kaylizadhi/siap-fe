"use client";

import { useState } from 'react';
import styles from '../../../styles/daftar-akun.module.css';

export default function DaftarAkun() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [accounts, setAccounts] = useState(
        Array(10).fill({
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
        const accountIndex = index + indexOfFirstAccount; // Adjust index for pagination
        setDeletingIndex(accountIndex); // Set the deleting index to trigger animation
        setTimeout(() => {
            const updatedAccounts = accounts.filter((_, i) => i !== accountIndex);
            setAccounts(updatedAccounts);
            setDeletingIndex(null); // Reset the deleting index after deletion
        }, 500); // Match this with the animation duration
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
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
                {/* <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    &lt; Sebelumnya
                </button>  */}
                {currentPage < totalPages && (
                    <button onClick={goToNextPage}>
                        Selanjutnya &gt;
                    </button>
                )}
            </div>
        </div>
    );
}
