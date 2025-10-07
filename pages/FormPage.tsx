
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockApi } from '../services/mockApi';
import type { Post } from '../types';
import { PostStatus, Category, ContactType } from '../types';
import { generateDescriptionWithGemini } from '../services/geminiService';

const contactPlaceholders: Record<ContactType, string> = {
    [ContactType.WhatsApp]: '6281234567890',
    [ContactType.Telegram]: 'username_telegram',
    [ContactType.Email]: 'email@example.com',
    [ContactType.Telepon]: '081234567890',
    [ContactType.Instagram]: 'username_ig',
    [ContactType.Line]: 'id_line',
    [ContactType.Lainnya]: 'Informasi kontak lainnya',
};

const FormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();
    
    const isEditMode = Boolean(id);
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        kategori: Category.Lainnya,
        status: PostStatus.Hilang,
        lokasi: '',
        tanggal: new Date().toISOString().split('T')[0],
        tipe_kontak: ContactType.WhatsApp,
        kontak: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchPost = async () => {
                setLoading(true);
                const post = await mockApi.getPostById(parseInt(id, 10));
                if (post && post.user_id === user?.id) {
                    setFormData({
                        judul: post.judul,
                        deskripsi: post.deskripsi,
                        kategori: post.kategori,
                        status: post.status,
                        lokasi: post.lokasi,
                        tanggal: post.tanggal,
                        tipe_kontak: post.tipe_kontak,
                        kontak: post.kontak,
                    });
                    setImagePreview(post.foto);
                } else {
                    addToast('Postingan tidak ditemukan atau Anda tidak berhak mengeditnya.', 'error');
                    navigate('/');
                }
                setLoading(false);
            };
            fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEditMode, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleGenerateDescription = async () => {
        if (!formData.judul) {
            addToast('Judul harus diisi untuk menghasilkan deskripsi.', 'warning');
            return;
        }
        setAiLoading(true);
        try {
            const description = await generateDescriptionWithGemini(formData.judul, imageFile);
            setFormData(prev => ({ ...prev, deskripsi: description }));
            addToast('Deskripsi berhasil dibuat oleh AI!', 'success');
        } catch (error) {
            addToast('Gagal membuat deskripsi AI.', 'error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.judul || !formData.deskripsi || !formData.lokasi || !formData.kontak) {
            addToast('Mohon lengkapi semua field yang wajib.', 'error');
            return;
        }
        if (!isEditMode && !imageFile) {
            addToast('Mohon unggah foto barang.', 'error');
            return;
        }

        setLoading(true);
        try {
            const postData = { ...formData, foto: imagePreview || 'https://picsum.photos/800/600', user_id: user.id };
            
            let savedPost: Post;
            if (isEditMode && id) {
                savedPost = await mockApi.updatePost(parseInt(id, 10), postData);
                addToast('Postingan berhasil diperbarui!', 'success');
            } else {
                savedPost = await mockApi.createPost(postData, user.id);
                addToast('Postingan berhasil dibuat!', 'success');
            }
            navigate(`/post/${savedPost.id}`);
        } catch (error) {
            addToast('Gagal menyimpan postingan.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <Link to={isEditMode ? `/post/${id}` : "/"} className="text-unsri-blue hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Kembali
                </Link>
            </div>
            <div className="bg-brand-card p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-unsri-blue mb-6">{isEditMode ? 'Edit Postingan' : 'Tambah Postingan Baru'}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul</label>
                        <input type="text" id="judul" name="judul" value={formData.judul} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                    </div>
                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows={4} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"></textarea>
                        <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} className="mt-2 text-sm text-unsri-light-blue hover:underline disabled:opacity-50">
                            {aiLoading ? 'Menghasilkan...' : '✨ Buat dengan AI'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                            <select id="kategori" name="kategori" value={formData.kategori} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold">
                                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold">
                                {Object.values(PostStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Lokasi</label>
                            <input type="text" id="lokasi" name="lokasi" value={formData.lokasi} onChange={handleChange} required placeholder="contoh: Fakultas Teknik" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                        </div>
                        <div>
                            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal</label>
                            <input type="date" id="tanggal" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="tipe_kontak" className="block text-sm font-medium text-gray-700">Tipe Kontak</label>
                            <select id="tipe_kontak" name="tipe_kontak" value={formData.tipe_kontak} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold">
                                {Object.values(ContactType).map(ct => <option key={ct} value={ct}>{ct}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="kontak" className="block text-sm font-medium text-gray-700">Kontak</label>
                            <input type="text" id="kontak" name="kontak" value={formData.kontak} onChange={handleChange} required placeholder={contactPlaceholders[formData.tipe_kontak]} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-unsri-gold focus:ring-unsri-gold"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto Barang</label>
                        <div className="mt-1 flex items-center">
                            {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md mr-4"/>}
                            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unsri-gold">
                                <span>Unggah Foto</span>
                                <input type="file" onChange={handleImageChange} className="sr-only" accept="image/png, image/jpeg"/>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Batal</button>
                        <button type="submit" disabled={loading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-unsri-blue bg-unsri-gold hover:bg-yellow-300 disabled:opacity-50">
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPage;
