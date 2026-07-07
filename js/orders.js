/**
 * Mandasari Premium - Manajemen Transaksi & Pesanan
 */

const PesananMandasari = {
    init: () => {},

    ambilPesananPelanggan: async () => {
        if (!Auth.isLoggedIn()) return [];
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: Storage.getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return [];
        } catch (error) {
            console.error("Gagal mengambil pesanan dari backend:", error);
            return [];
        }
    },

    cariBerdasarkanId: async (idTransaksi) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${idTransaksi}`, {
                headers: Storage.getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return null;
        } catch (error) {
            console.error("Gagal mengambil detail pesanan:", error);
            return null;
        }
    },

    perbaruiStatus: async (idTransaksi, statusBaru) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${idTransaksi}/status`, {
                method: 'PUT',
                headers: Storage.getHeaders(),
                body: JSON.stringify({ status: statusBaru })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Gagal memperbarui status pesanan:", error);
            return false;
        }
    },

    rateProduct: async (orderId, productId, rating) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/items/${productId}/rate`, {
                method: 'POST',
                headers: Storage.getHeaders(),
                body: JSON.stringify({ rating })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Gagal memberikan rating produk:", error);
            return false;
        }
    }
};

PesananMandasari.getUserOrders = PesananMandasari.ambilPesananPelanggan;
PesananMandasari.updateOrderStatus = PesananMandasari.perbaruiStatus;
window.Orders = PesananMandasari;
window.PesananMandasari = PesananMandasari;
