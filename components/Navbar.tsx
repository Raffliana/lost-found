
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UnsriLogo from './icons/UnsriLogo';

interface NavbarProps {
    onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    return (
        <header className="bg-gradient-to-r from-unsri-blue to-unsri-light-blue text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="https://i.imgur.com/unsri-logo.png" alt="Logo Unsri" className="h-10 w-10"/>
                            <span className="text-xl font-bold tracking-wider">Lost & Found Unsri</span>
                        </Link>
                    </div>

                    {onSearch && (
                        <div className="hidden md:block flex-1 max-w-lg mx-4">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <input
                                        type="search"
                                        name="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white bg-opacity-20 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:bg-opacity-30 focus:ring-2 focus:ring-unsri-gold"
                                        placeholder="Cari barang..."
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-unsri-gold">
                            <span className="font-medium">{user?.nama_lengkap}</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" onMouseLeave={() => setDropdownOpen(false)}>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {onSearch && (
                    <div className="md:hidden p-2">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white bg-opacity-20 rounded-md py-2 pl-4 pr-4 text-white placeholder-gray-300 focus:outline-none focus:bg-opacity-30 focus:ring-2 focus:ring-unsri-gold"
                                placeholder="Cari barang..."
                            />
                        </form>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
