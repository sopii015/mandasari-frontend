/**
 * Mandasari Premium - Authentication System
 */

const MandasariAuth = {
    sesi: Storage.get(STORAGE_KEYS.SESSION),

    init: () => {
        MandasariAuth.perbaruiTampilanNavigasi();
    },

    isLoggedIn: () => {
        return MandasariAuth.sesi !== null;
    },

    getUserAktif: () => {
        return MandasariAuth.sesi;
    },

    isEmailTersedia: async (email) => {
        // Server will check email availability on register
        return true;
    },

    perbaruiTampilanNavigasi: () => {
        const menuUser = document.getElementById('user-profile-dropdown') || document.getElementById('user-menu');
        const linkAuth = document.getElementById('auth-buttons-group') || document.getElementById('auth-links');
        const namaUserEl = document.getElementById('display-user-name') || document.getElementById('user-greeting');

        const mobileAuthGroup = document.getElementById('mobile-auth-buttons-group');
        const mobileUserGroup = document.getElementById('mobile-user-profile-group');

        const statusLogin = MandasariAuth.isLoggedIn();

        if (statusLogin) {
            if (menuUser) menuUser.classList.remove('hidden');
            if (linkAuth) linkAuth.classList.add('hidden');
            if (namaUserEl) {
                const panggilan = MandasariAuth.sesi.name.split(' ')[0];
                namaUserEl.textContent = `Halo, ${panggilan}`;
            }
            if (mobileAuthGroup) mobileAuthGroup.classList.add('hidden');
            if (mobileUserGroup) mobileUserGroup.classList.remove('hidden');

            // Jika admin, pastikan ada link ke dashboard admin di dropdown
            const dropdownContent = document.querySelector('.dropdown-content') || (menuUser && menuUser.querySelector('.dropdown-content'));
            if (dropdownContent && MandasariAuth.sesi.role === 'admin' && !document.getElementById('admin-menu-link')) {
                const adminLink = document.createElement('a');
                adminLink.id = 'admin-menu-link';
                adminLink.href = 'admin.html';
                adminLink.className = 'block px-4 py-3 text-sm font-semibold text-mandasari-gold hover:bg-mandasari-cream border-b border-slate-50';
                adminLink.textContent = 'Dashboard Admin';
                dropdownContent.insertBefore(adminLink, dropdownContent.firstChild);
            }
        } else {
            if (menuUser) menuUser.classList.add('hidden');
            if (linkAuth) linkAuth.classList.remove('hidden');
            if (mobileAuthGroup) mobileAuthGroup.classList.remove('hidden');
            if (mobileUserGroup) mobileUserGroup.classList.add('hidden');
        }
    },

    daftar: async (nama, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nama, email, password, role: 'customer' })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Register Error:", error);
            return { success: false, message: 'Gagal terhubung ke server backend.' };
        }
    },

    masuk: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                Storage.setToken(data.token);
                const dataSesi = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                };
                MandasariAuth.sesi = dataSesi;
                Storage.set(STORAGE_KEYS.SESSION, dataSesi);
                MandasariAuth.perbaruiTampilanNavigasi();
            }
            return data;
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: 'Gagal terhubung ke server backend.' };
        }
    },

    simpanSesi: (data) => {
        MandasariAuth.sesi = data;
        Storage.set(STORAGE_KEYS.SESSION, data);
        MandasariAuth.perbaruiTampilanNavigasi();
    },

    keluar: () => {
        MandasariAuth.sesi = null;
        Storage.remove(STORAGE_KEYS.SESSION);
        Storage.removeToken();
        MandasariAuth.perbaruiTampilanNavigasi();

        if (typeof Toast !== 'undefined') Toast.show('Anda telah keluar dari akun.', 'info');

        const privatePages = ['checkout.html', 'admin.html', 'orders.html', 'wishlist.html'];
        const path = window.location.pathname;
        if (privatePages.some(page => path.includes(page))) {
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            setTimeout(() => window.location.reload(), 1000);
        }
    },

    requireLogin: (callback) => {
        if (MandasariAuth.isLoggedIn()) {
            if (callback) callback();
            return true;
        } else {
            if (typeof Toast !== 'undefined') Toast.show('Silakan login terlebih dahulu.', 'warning');
            setTimeout(() => window.location.href = 'login.html', 1200);
            return false;
        }
    }
};

document.addEventListener('DOMContentLoaded', MandasariAuth.init);

document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('.action-logout') || e.target.closest('#logout-btn');
    if (logoutBtn) {
        e.preventDefault();
        MandasariAuth.keluar();
    }
});

// Alias & mapping
MandasariAuth.login = MandasariAuth.masuk;
MandasariAuth.register = MandasariAuth.daftar;
MandasariAuth.proteksiFitur = MandasariAuth.requireLogin;
window.Auth = MandasariAuth;
