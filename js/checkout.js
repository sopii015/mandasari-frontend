/**
 * Mandasari Premium - Checkout & Order Processing
 */

const ProsesCheckout = {
    init: () => {
        if (Cart.loaded && Cart.items.length === 0) {
            Toast.show('Keranjang Anda masih kosong', 'warning');
            setTimeout(() => window.location.href = 'index.html', 2000);
        }
    },

    /**
     * Memproses Pesanan Akhir
     */
    buatPesanan: async (dataPengiriman, metodeBayar) => {
        if (!Auth.isLoggedIn()) {
            Toast.show('Sesi berakhir, silakan login kembali', 'error');
            return null;
        }

        const items = Cart.items;
        if (items.length === 0) {
            Toast.show('Tidak ada produk untuk diproses', 'error');
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/checkout`, {
                method: 'POST',
                headers: Storage.getHeaders(),
                body: JSON.stringify({
                    dataPengiriman,
                    paymentMethod: metodeBayar
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Bersihkan keranjang lokal cache
                await Cart.kosongkan();

                // Simpan URL WhatsApp ke session agar bisa dibuka oleh UI
                sessionStorage.setItem('last_whatsapp_url', data.whatsappUrl);

                return {
                    success: true,
                    orderId: data.orderId,
                    whatsappUrl: data.whatsappUrl
                };
            } else {
                Toast.show(data.message || 'Gagal memproses pesanan.', 'error');
                return null;
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            Toast.show('Gagal menghubungi server.', 'error');
            return null;
        }
    }
};

window.ProsesCheckout = ProsesCheckout;