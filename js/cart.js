/**
 * Mandasari Premium - Keranjang Belanja Logic
 */

const KeranjangMandasari = {
    items: [],

    init: async () => {
        if (Auth.isLoggedIn()) {
            await KeranjangMandasari.muatCart();
        } else {
            KeranjangMandasari.items = [];
            KeranjangMandasari.perbaruiBadgeNavigasi();
        }
    },

    muatCart: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                headers: Storage.getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                KeranjangMandasari.items = data;
                KeranjangMandasari.perbaruiBadgeNavigasi();
                window.dispatchEvent(new CustomEvent('update-tampilan-keranjang'));
            }
        } catch (error) {
            console.error("Gagal memuat keranjang dari backend:", error);
        }
    },

    tambahProduk: async (produk, jumlah = 1) => {
        if (!Auth.isLoggedIn()) {
            if (typeof Toast !== 'undefined') Toast.show('Silakan masuk akun untuk mulai belanja', 'warning');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: Storage.getHeaders(),
                body: JSON.stringify({
                    productId: produk.id,
                    quantity: jumlah,
                    overwrite: false
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (typeof Toast !== 'undefined') Toast.show(`${produk.name} berhasil masuk keranjang`, 'success');
                await KeranjangMandasari.muatCart();
                return true;
            } else {
                if (typeof Toast !== 'undefined') Toast.show(data.message || 'Gagal menambahkan produk', 'error');
                return false;
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            if (typeof Toast !== 'undefined') Toast.show('Gagal terhubung ke server.', 'error');
            return false;
        }
    },

    addById: async (id, jumlah = 1) => {
        if (typeof KatalogMandasari !== 'undefined') {
            const produk = KatalogMandasari.ambilBerdasarkanId(id);
            if (produk) {
                await KeranjangMandasari.tambahProduk(produk, jumlah);
            }
        }
    },

    hapusItem: async (idProduk) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/${idProduk}`, {
                method: 'DELETE',
                headers: Storage.getHeaders()
            });

            if (response.ok) {
                await KeranjangMandasari.muatCart();
            } else {
                if (typeof Toast !== 'undefined') Toast.show('Gagal menghapus item.', 'error');
            }
        } catch (error) {
            console.error("Error removing cart item:", error);
        }
    },

    updateJumlah: async (idProduk, jumlahBaru) => {
        const item = KeranjangMandasari.items.find(i => i.id === idProduk);
        if (!item) return false;

        if (jumlahBaru <= 0) {
            await KeranjangMandasari.hapusItem(idProduk);
            return true;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: Storage.getHeaders(),
                body: JSON.stringify({
                    productId: idProduk,
                    quantity: jumlahBaru,
                    overwrite: true
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                await KeranjangMandasari.muatCart();
                return true;
            } else {
                if (typeof Toast !== 'undefined') Toast.show(data.message || 'Gagal mengubah jumlah', 'warning');
                // Reload cart to sync state
                await KeranjangMandasari.muatCart();
                return false;
            }
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            return false;
        }
    },

    kosongkan: async () => {
        // Backend empties cart during checkout automatically, but let's clear local cache too
        KeranjangMandasari.items = [];
        KeranjangMandasari.perbaruiBadgeNavigasi();
        window.dispatchEvent(new CustomEvent('update-tampilan-keranjang'));
    },

    hitungRingkasan: () => {
        const subtotal = KeranjangMandasari.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const biayaLayanan = 0; // Gratis Ongkir
        const totalAkhir = subtotal + biayaLayanan;

        return { subtotal, biayaLayanan, totalAkhir };
    },

    formatRupiah: (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    },

    perbaruiBadgeNavigasi: () => {
        const badgeIds = ['cart-badge', 'cart-badge-desktop', 'cart-badge-mobile'];
        const totalKuantitas = KeranjangMandasari.items.reduce((acc, item) => acc + item.quantity, 0);

        badgeIds.forEach(id => {
            const badge = document.getElementById(id);
            if (badge) {
                if (totalKuantitas > 0) {
                    badge.textContent = totalKuantitas;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        });
    }
};

KeranjangMandasari.add = KeranjangMandasari.tambahProduk;
KeranjangMandasari.formatCurrency = KeranjangMandasari.formatRupiah;
window.Cart = KeranjangMandasari;
window.KeranjangMandasari = KeranjangMandasari;

window.addEventListener('DOMContentLoaded', KeranjangMandasari.init);
// Muat ulang ketika login terdeteksi
window.addEventListener('favorit-diperbarui', KeranjangMandasari.init);
