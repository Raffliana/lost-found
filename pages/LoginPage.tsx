
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import UnsriLogo from '../components/icons/UnsriLogo';

const LoginPage: React.FC = () => {
    const { login, user } = useAuth();
    const { addToast } = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            addToast('Username dan password harus diisi', 'error');
            return;
        }
        setLoading(true);
        try {
            await login(username);
            addToast('Login berhasil!', 'success');
        } catch (error) {
            addToast(error instanceof Error ? error.message : 'Login gagal', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-unsri-blue to-unsri-light-blue p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-4">
                    <img src="https://i.imgur.com/unsri-logo.png" alt="Logo Unsri" className="w-24 h-24 mx-auto"/>
                    <h1 className="text-3xl font-bold text-unsri-blue">Lost & Found Unsri</h1>
                    <p className="text-gray-500">Silakan login untuk melanjutkan</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-unsri-gold focus:border-unsri-gold"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-login" className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password-login"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-unsri-gold focus:border-unsri-gold"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-unsri-blue bg-unsri-gold hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unsri-gold disabled:bg-yellow-200 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-medium text-unsri-blue hover:text-unsri-light-blue">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
