
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage: React.FC = () => {
    const { register, user } = useAuth();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nama_lengkap: '',
        email: '',
        no_telepon: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { username, password, nama_lengkap, email } = formData;
        if (!username || !password || !nama_lengkap || !email) {
            addToast('Semua field wajib diisi kecuali No. Telepon', 'error');
            return;
        }
        setLoading(true);
        try {
            await register(formData);
            addToast('Registrasi berhasil!', 'success');
        } catch (error) {
            addToast(error instanceof Error ? error.message : 'Registrasi gagal', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <img src="https://i.imgur.com/unsri-logo.png" alt="Logo Unsri" className="w-20 h-20 mx-auto mb-2"/>
                    <h1 className="text-2xl font-bold text-unsri-blue">Buat Akun Baru</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" name="username" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" name="nama_lengkap" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">No. Telepon (Opsional)</label>
                        <input type="tel" name="no_telepon" onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-unsri-blue bg-unsri-gold hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unsri-gold disabled:bg-yellow-200"
                    >
                        {loading ? 'Mendaftar...' : 'Daftar'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-medium text-unsri-blue hover:text-unsri-light-blue">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
