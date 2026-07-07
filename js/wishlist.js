/**
 * Mandasari Premium - Manajemen Produk Favorit (Wishlist)
 */

const FavoritMandasari = {
    items: [],

    init: async () => {
        if (Auth.isLoggedIn()) {
            await FavoritMandasari.muatWishlist();
        }
    },

    muatWishlist: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
                headers: Storage.getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                FavoritMandasari.items = data;
                window.dispatchEvent(new Event('wishlist-updated'));
                window.dispatchEvent(new Event('favorit-diperbarui'));
            }
        } catch (error) {
            console.error("Gagal memuat wishlist dari backend:", error);
        }
    },

    ambilSemuaFavorit: () => {
        return FavoritMandasari.items;
    },

    hapusFavorit: async (idProduk) => {
        await FavoritMandasari.toggle(idProduk);
    },

    apakahFavorit: (idProduk) => {
        return FavoritMandasari.items.some(item => item.id === parseInt(idProduk));
    },

    toggle: async (idProduk) => {
        if (!Auth.isLoggedIn()) {
            if (typeof Toast !== 'undefined') Toast.show('Silakan login terlebih dahulu.', 'warning');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/wishlist/${idProduk}`, {
                method: 'POST',
                headers: Storage.getHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                if (typeof Toast !== 'undefined') Toast.show(data.message, data.isFavorite ? 'success' : 'info');
                
                // Muat ulang wishlist untuk menyamakan state cache
                await FavoritMandasari.muatWishlist();
            } else {
                if (typeof Toast !== 'undefined') Toast.show('Gagal memperbarui wishlist.', 'error');
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            if (typeof Toast !== 'undefined') Toast.show('Kesalahan koneksi ke server.', 'error');
        }
    }
};

FavoritMandasari.getItems = FavoritMandasari.ambilSemuaFavorit;
window.Wishlist = FavoritMandasari;
window.FavoritMandasari = FavoritMandasari;

document.addEventListener('DOMContentLoaded', () => {
    FavoritMandasari.init();
});
