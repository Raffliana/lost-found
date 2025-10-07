
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { Category, PostStatus } from '../types';
import { mockApi } from '../services/mockApi';

const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded mt-4"></div>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        kategori: 'Semua',
        status: 'Semua',
    });

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedPosts = await mockApi.getPosts(filters);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
    };

    return (
        <>
            <Navbar onSearch={handleSearch} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-1/4 lg:w-1/5">
                        <div className="bg-brand-card p-4 rounded-lg shadow-md sticky top-24">
                            <h3 className="text-lg font-bold text-unsri-blue mb-4">Filter</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                                    <select
                                        id="kategori"
                                        name="kategori"
                                        value={filters.kategori}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-unsri-blue focus:border-unsri-blue sm:text-sm rounded-md"
                                    >
                                        <option>Semua</option>
                                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-unsri-blue focus:border-unsri-blue sm:text-sm rounded-md"
                                    >
                                        <option>Semua</option>
                                        {Object.values(PostStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map(post => <PostCard key={post.id} post={post} />)}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-brand-card rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-unsri-blue">Tidak Ada Postingan</h2>
                                <p className="text-gray-500 mt-2">Belum ada postingan yang cocok dengan filter Anda. Coba buat postingan baru!</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Link
                to="/new"
                className="fixed bottom-8 right-8 bg-unsri-gold text-unsri-blue rounded-full p-4 shadow-lg hover:bg-yellow-300 transition-transform transform hover:scale-110"
                aria-label="Tambah Postingan"
            >
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </Link>
        </>
    );
};

export default HomePage;
