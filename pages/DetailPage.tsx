
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { PostStatus, Category, ContactType } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

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

const ContactButton: React.FC<{ post: Post }> = ({ post }) => {
    const { tipe_kontak, kontak } = post;
    let href = '#';
    let text = `Hubungi via ${tipe_kontak}`;
    let bgColor = 'bg-gray-500';
    let icon = '...';

    const handleContactClick = (e: React.MouseEvent) => {
        switch (tipe_kontak) {
            case ContactType.WhatsApp:
                e.preventDefault();
                window.open(`https://wa.me/${kontak.replace(/[^0-9]/g, '')}`, '_blank');
                break;
            case ContactType.Telegram:
                e.preventDefault();
                window.open(`https://t.me/${kontak.replace('@', '')}`, '_blank');
                break;
            case ContactType.Email:
                window.location.href = `mailto:${kontak}`;
                break;
            case ContactType.Telepon:
                window.location.href = `tel:${kontak}`;
                break;
            case ContactType.Instagram:
                e.preventDefault();
                window.open(`https://instagram.com/${kontak.replace('@', '')}`, '_blank');
                break;
            case ContactType.Line:
                e.preventDefault();
                alert(`ID Line: ${kontak}\nSilakan salin dan cari di aplikasi Line.`);
                break;
            default:
                e.preventDefault();
                alert(`Info Kontak: ${kontak}`);
                break;
        }
    };
    
    switch (tipe_kontak) {
        case ContactType.WhatsApp: bgColor = 'bg-green-500'; icon = '💬'; break;
        case ContactType.Telegram: bgColor = 'bg-blue-500'; icon = '➤'; break;
        case ContactType.Email: bgColor = 'bg-red-500'; icon = '✉️'; break;
        case ContactType.Telepon: bgColor = 'bg-gray-700'; icon = '📞'; break;
        case ContactType.Instagram: bgColor = 'bg-pink-500'; icon = '📷'; break;
        case ContactType.Line: bgColor = 'bg-green-400'; icon = 'L'; break;
    }
    
    return (
        <a href={href} onClick={handleContactClick} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity ${bgColor}`}>
            <span className="mr-2 text-xl">{icon}</span> {text}
        </a>
    )
}

const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                setLoading(true);
                try {
                    const fetchedPost = await mockApi.getPostById(parseInt(id, 10));
                    if (fetchedPost) {
                        setPost(fetchedPost);
                    } else {
                        addToast('Postingan tidak ditemukan', 'error');
                        navigate('/');
                    }
                } catch (error) {
                    addToast('Gagal memuat postingan', 'error');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);
    
    const handleDelete = async () => {
        if (!post) return;
        try {
            await mockApi.deletePost(post.id);
            addToast('Postingan berhasil dihapus', 'success');
            navigate('/');
        } catch (error) {
            addToast('Gagal menghapus postingan', 'error');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-unsri-blue"></div></div>;
    if (!post) return <div className="text-center py-10">Post not found.</div>;

    const isOwner = user?.id === post.user_id;

    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Postingan"
            >
                Yakin ingin menghapus postingan ini? Tindakan ini tidak dapat diurungkan.
            </Modal>
            <div className="mb-6">
                <Link to="/" className="text-unsri-blue hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Kembali ke Home
                </Link>
            </div>
            <div className="bg-brand-card rounded-lg shadow-xl overflow-hidden">
                <img src={post.foto} alt={post.judul} className="w-full h-64 md:h-96 object-cover" />
                <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${statusColorMap[post.status]}`}>{post.status}</span>
                        <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${categoryColorMap[post.kategori]}`}>{post.kategori}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-unsri-blue mb-4">{post.judul}</h1>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{post.deskripsi}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start"><span className="mr-3 mt-1">📍</span><div><span className="font-semibold">Lokasi:</span><br/>{post.lokasi}</div></div>
                            <div className="flex items-start"><span className="mr-3 mt-1">📅</span><div><span className="font-semibold">Tanggal:</span><br/>{new Date(post.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-unsri-blue mb-2">Hubungi Penemu/Pemilik</h3>
                            <p className="text-sm text-gray-600 mb-4">Diposting oleh: <strong>{post.user.nama_lengkap}</strong></p>
                            <ContactButton post={post} />
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex items-center justify-end gap-4 border-t pt-6">
                            <Link to={`/edit/${post.id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-unsri-light-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                ✏️ Edit
                            </Link>
                            <button onClick={() => setDeleteModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                🗑️ Hapus
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
