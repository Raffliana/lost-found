
import { Post, User, PostStatus, Category, ContactType } from '../types';

let users: User[] = [
    { id: 1, username: 'admin', nama_lengkap: 'Admin Unsri', email: 'admin@unsri.ac.id' },
];

let posts: Post[] = [
    {
        id: 1,
        user_id: 1,
        user: users[0],
        judul: 'Macbook Pro M1 Ditemukan',
        deskripsi: 'Ditemukan Macbook Pro M1 14 inch warna space gray di perpustakaan pusat lantai 2. Kondisi mulus, ada stiker Unsri di bagian belakang. Silakan hubungi jika merasa kehilangan.',
        kategori: Category.Elektronik,
        status: PostStatus.Temuan,
        lokasi: 'Perpustakaan Pusat Unsri',
        tanggal: '2024-07-20',
        tipe_kontak: ContactType.WhatsApp,
        kontak: '6281234567890',
        foto: 'https://picsum.photos/seed/macbook/800/600',
        created_at: '2024-07-21T10:00:00Z'
    },
    {
        id: 2,
        user_id: 1,
        user: users[0],
        judul: 'Kehilangan Kunci Motor Honda',
        deskripsi: 'Telah hilang satu buah kunci motor Honda Vario dengan gantungan kunci logo Fakultas Teknik. Terakhir terlihat di sekitar area parkir Fasilkom. Bagi yang menemukan harap hubungi.',
        kategori: Category.Lainnya,
        status: PostStatus.Hilang,
        lokasi: 'Parkiran Fasilkom',
        tanggal: '2024-07-19',
        tipe_kontak: ContactType.Telegram,
        kontak: 'adminunsri',
        foto: 'https://picsum.photos/seed/keys/800/600',
        created_at: '2024-07-21T11:30:00Z'
    },
    {
        id: 3,
        user_id: 1,
        user: users[0],
        judul: 'Buku Kalkulus I Tertinggal',
        deskripsi: 'Buku Kalkulus I karangan Purcell edisi 9 tertinggal di GKB 1. Ada nama "Budi Hartono" di halaman depan. Mohon bantuannya.',
        kategori: Category.Buku,
        status: PostStatus.Hilang,
        lokasi: 'Gedung Kuliah Bersama (GKB) 1',
        tanggal: '2024-07-22',
        tipe_kontak: ContactType.Email,
        kontak: 'budi.h@student.unsri.ac.id',
        foto: 'https://picsum.photos/seed/book/800/600',
        created_at: '2024-07-22T09:00:00Z'
    }
];
let nextUserId = 2;
let nextPostId = 4;

const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

export const mockApi = {
    register: async (userData: Omit<User, 'id'>): Promise<User> => {
        if (users.find(u => u.username === userData.username)) {
            throw new Error('Username already exists');
        }
        const newUser: User = { id: nextUserId++, ...userData };
        users.push(newUser);
        return simulateDelay(newUser);
    },
    login: async (username: string): Promise<User> => {
        const user = users.find(u => u.username === username);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // In a real app, password would be checked here
        return simulateDelay(user);
    },
    getPosts: async (filters: { search?: string; kategori?: string; status?: string }): Promise<Post[]> => {
        let filteredPosts = posts;
        if (filters.search) {
            filteredPosts = filteredPosts.filter(p => p.judul.toLowerCase().includes(filters.search!.toLowerCase()));
        }
        if (filters.kategori && filters.kategori !== 'Semua') {
            filteredPosts = filteredPosts.filter(p => p.kategori === filters.kategori);
        }
        if (filters.status && filters.status !== 'Semua') {
            filteredPosts = filteredPosts.filter(p => p.status === filters.status);
        }
        return simulateDelay(filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    },
    getPostById: async (id: number): Promise<Post | undefined> => {
        const post = posts.find(p => p.id === id);
        return simulateDelay(post);
    },
    createPost: async (postData: Omit<Post, 'id' | 'user' | 'created_at'>, userId: number): Promise<Post> => {
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');
        const newPost: Post = {
            id: nextPostId++,
            ...postData,
            user,
            created_at: new Date().toISOString()
        };
        posts.unshift(newPost);
        return simulateDelay(newPost);
    },
    updatePost: async (id: number, postData: Partial<Omit<Post, 'id' | 'user_id' | 'user' | 'created_at'>>): Promise<Post> => {
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex === -1) throw new Error('Post not found');
        posts[postIndex] = { ...posts[postIndex], ...postData };
        return simulateDelay(posts[postIndex]);
    },
    deletePost: async (id: number): Promise<{ success: boolean }> => {
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex === -1) throw new Error('Post not found');
        posts.splice(postIndex, 1);
        return simulateDelay({ success: true });
    },
};