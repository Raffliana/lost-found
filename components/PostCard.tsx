
import React from 'react';
import type { Post } from '../types';
import { PostStatus, Category } from '../types';
import { Link } from 'react-router-dom';

interface PostCardProps {
    post: Post;
}

const statusColorMap: Record<PostStatus, string> = {
    [PostStatus.Hilang]: 'bg-red-100 text-red-800',
    [PostStatus.Temuan]: 'bg-green-100 text-green-800',
};

const categoryColorMap: Record<Category, string> = {
    [Category.Elektronik]: 'bg-blue-100 text-blue-800',
    [Category.Buku]: 'bg-green-100 text-green-800',
    [Category.Pakaian]: 'bg-purple-100 text-purple-800',
    [Category.Lainnya]: 'bg-gray-100 text-gray-800',
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-brand-card rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="relative">
                <img src={post.foto} alt={post.judul} className="w-full h-48 object-cover" />
                <span className={`absolute top-2 left-2 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${statusColorMap[post.status]}`}>
                    {post.status}
                </span>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="mb-2">
                    <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${categoryColorMap[post.kategori]}`}>
                        {post.kategori}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-unsri-blue mb-2 truncate">{post.judul}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                    <p className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span className="truncate">{post.lokasi}</span>
                    </p>
                    <p className="flex items-center">
                        <span className="mr-2">📅</span>
                        {formatDate(post.tanggal)}
                    </p>
                    <p className="flex items-center">
                        <span className="mr-2">👤</span>
                        {post.user.nama_lengkap}
                    </p>
                </div>
                <Link to={`/post/${post.id}`} className="mt-auto block w-full text-center bg-unsri-gold text-unsri-blue font-bold py-2 px-4 rounded-md hover:bg-yellow-300 transition-colors duration-300">
                    Lihat Detail
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
