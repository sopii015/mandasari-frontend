/**
 * Mandasari Premium - LocalStorage & API Config Manager
 */

const API_BASE_URL = 'https://backend-production-83a1.up.railway.app';

const STORAGE_KEYS = {
    USERS: 'mandasari_pelanggan',
    SESSION: 'mandasari_sesi_aktif', // Menyimpan objek user yang aktif { id, name, email, role }
    THEME: 'mandasari_tema_visual'
};

const Storage = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Gagal mengambil data ${key}:`, error);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Gagal menyimpan data ${key}:`, error);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    init: () => {
        if (!Storage.get(STORAGE_KEYS.THEME)) Storage.set(STORAGE_KEYS.THEME, 'light');
        console.log("Storage Mandasari Siap. API Base URL:", API_BASE_URL);
    },
    
    // JWT Token Helpers
    getToken: () => {
        return localStorage.getItem('mandasari_token');
    },
    setToken: (token) => {
        localStorage.setItem('mandasari_token', token);
    },
    removeToken: () => {
        localStorage.removeItem('mandasari_token');
    },
    
    // Auth Headers Helper
    getHeaders: (contentType = true) => {
        const token = Storage.getToken();
        const headers = {};
        if (contentType) {
            headers['Content-Type'] = 'application/json';
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
};

Storage.init();
