"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/generator-dokumen.module.css'; 

const KwitansiDP = () => {
    const router = useRouter();
    const [docType, setDocType] = useState('');

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/accounts/check_role_administrasi/', {
                    headers: { 'Authorization': `Token ${token}` },
                });
                const data = await response.json();

                if (data.error || data.role !== 'Administrasi') {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Failed to verify role:', error);
                router.push('/login');
            }
        };
        verifyUser();
    }, [router]);

    
}