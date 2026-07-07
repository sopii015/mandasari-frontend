/**
 * Mandasari Premium - Panel Kendali Admin
 */

const AdminController = {
    allOrders: [],
    allProducts: [],

    init: async () => {
        const session = Storage.get(STORAGE_KEYS.SESSION);
        if (!Auth.isLoggedIn() || !session || session.role !== 'admin') {
            if (typeof Toast !== 'undefined') Toast.show('Akses khusus Admin!', 'error');
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            return;
        }

        // Setup submit listener for product form
        const prodForm = document.getElementById('product-form');
        if (prodForm) {
            prodForm.addEventListener('submit', AdminController.handleFormSubmit);
        }
        
        await AdminController.loadDashboardStats();
        await AdminController.loadProducts();
    },

    switchTab: (tab) => {
        const panelOrders = document.getElementById('panel-orders');
        const panelProducts = document.getElementById('panel-products');
        
        const btnTabOrders = document.getElementById('btn-tab-orders');
        const btnTabProducts = document.getElementById('btn-tab-products');

        if (tab === 'orders') {
            panelOrders.classList.remove('hidden');
            panelProducts.classList.add('hidden');
            
            btnTabOrders.className = 'tab-btn px-6 py-3 rounded-full font-bold text-sm bg-mandasari-navy text-white shadow-lg transition-all';
            btnTabProducts.className = 'tab-btn px-6 py-3 rounded-full font-bold text-sm bg-white text-mandasari-navy border border-mandasari-navy/20 hover:border-mandasari-navy transition-all';
        } else {
            panelOrders.classList.add('hidden');
            panelProducts.classList.remove('hidden');

            btnTabOrders.className = 'tab-btn px-6 py-3 rounded-full font-bold text-sm bg-white text-mandasari-navy border border-mandasari-navy/20 hover:border-mandasari-navy transition-all';
            btnTabProducts.className = 'tab-btn px-6 py-3 rounded-full font-bold text-sm bg-mandasari-navy text-white shadow-lg transition-all';
        }
    },

    loadDashboardStats: async () => {
        try {
            // Admin can see all orders via orders.getUserOrders since role is admin
            const orders = await Orders.getUserOrders();
            AdminController.allOrders = orders;

            let totalPendapatan = 0;
            const uniqueUsers = new Set();

            orders.forEach(order => {
                totalPendapatan += Number(order.total || 0);
                if (order.customerEmail) {
                    uniqueUsers.add(order.customerEmail);
                }
            });

            // Update UI
            const userEl = document.getElementById('stat-users');
            const orderEl = document.getElementById('stat-orders');
            const revenueEl = document.getElementById('stat-revenue');

            if (userEl) userEl.textContent = uniqueUsers.size > 0 ? uniqueUsers.size : '1';
            if (orderEl) orderEl.textContent = orders.length;
            if (revenueEl) revenueEl.textContent = Cart.formatCurrency(totalPendapatan);

            AdminController.renderDaftarTransaksi(orders);
        } catch (error) {
            console.error("Gagal memuat statistik dashboard:", error);
        }
    },

    renderDaftarTransaksi: (pesanan) => {
        const tabelBody = document.getElementById('orders-tbody');
        if (!tabelBody) return;

        if (pesanan.length === 0) {
            tabelBody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-10 text-center text-slate-400 font-medium">
                        Belum ada transaksi masuk untuk saat ini.
                    </td>
                </tr>`;
            return;
        }

        // Urutkan berdasarkan tanggal terbaru
        const sortedOrders = [...pesanan].sort((a, b) => new Date(b.date) - new Date(a.date));

        tabelBody.innerHTML = sortedOrders.map(order => {
            let badgeClass = '';
            let statusIndo = '';

            switch (order.status) {
                case 'Processing':
                    badgeClass = 'bg-amber-100 text-amber-700 border-amber-200';
                    statusIndo = 'Diproses';
                    break;
                case 'Shipped':
                    badgeClass = 'bg-blue-100 text-blue-700 border-blue-200';
                    statusIndo = 'Dikirim';
                    break;
                case 'Delivered':
                    badgeClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                    statusIndo = 'Selesai';
                    break;
                default:
                    badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                    statusIndo = order.status;
            }

            return `
                <tr class="border-b border-mandasari-gold/5 hover:bg-mandasari-cream/30 transition-colors">
                    <td class="py-4 px-6 font-mono text-xs text-mandasari-gold font-bold">#${order.id}</td>
                    <td class="py-4 px-6">
                        <div class="text-sm font-bold text-mandasari-navy">${order.customerName || 'Customer'}</div>
                        <div class="text-[10px] text-slate-400">${order.customerEmail || ''}</div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${badgeClass}">
                            ${statusIndo}
                        </span>
                    </td>
                    <td class="py-4 px-6 font-bold text-sm text-right">${Cart.formatCurrency(order.total)}</td>
                    <td class="py-4 px-6 text-center">
                        <select 
                            onchange="AdminController.ubahStatusPesanan('${order.id}', this.value)" 
                            class="bg-white border border-mandasari-gold/20 rounded-lg px-2 py-1.5 text-[11px] font-bold focus:ring-2 focus:ring-mandasari-gold/20 outline-none cursor-pointer"
                        >
                            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Proses</option>
                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Kirim</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Selesai</option>
                        </select>
                    </td>
                    <td class="py-4 px-6 text-center">
                        <button onclick="AdminController.kirimWAManual('${order.id}')" class="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors active:scale-95">
                            <i data-lucide="send" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    ubahStatusPesanan: async (idPesanan, statusBaru) => {
        const berhasil = await Orders.updateOrderStatus(idPesanan, statusBaru);
        
        if (berhasil) {
            if (typeof Toast !== 'undefined') Toast.show(`Pesanan ${idPesanan.substring(0, 8)} diperbarui ke: ${statusBaru}`, 'success');
            await AdminController.loadDashboardStats();
        } else {
            if (typeof Toast !== 'undefined') Toast.show("Gagal memperbarui status pesanan", "error");
        }
    },

    kirimWAManual: (idPesanan) => {
        const order = AdminController.allOrders.find(o => o.id === idPesanan);
        if (!order) return;

        const itemsTxt = order.items.map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity}x)`).join('\n');
        
        const rawMessage = `Halo Owner Mandasari Premium, berikut ringkasan pesanan baru:

🛍️ *Pesanan Kue Mandasari*
- *ID Order:* ${order.id}
- *Customer:* ${order.customerName} (${order.customerEmail})
- *Metode Bayar:* ${order.paymentMethod}

📍 *Alamat Pengiriman:*
- *Penerima:* ${order.pengiriman.penerima}
- *Telepon:* ${order.pengiriman.telepon}
- *Alamat:* ${order.pengiriman.alamatLengkap}
- *Catatan:* ${order.pengiriman.catatan || '-'}

🍰 *Item Pesanan:*
${itemsTxt}

💵 *Rincian Biaya:*
- *Total Bayar:* *${Cart.formatCurrency(order.total)}*`;

        const encodedMessage = encodeURIComponent(rawMessage);
        // OWNER_PHONE fallback
        const whatsappUrl = `https://wa.me/6285773153093?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    },

    // ==========================================
    // KELOLA PRODUK (CRUD)
    // ==========================================
    
    loadProducts: async () => {
        const tbody = document.getElementById('products-tbody');
        if (!tbody) return;

        try {
            // Ambil produk kue dari backend
            const response = await fetch(`${API_BASE_URL}/api/products`);
            if (response.ok) {
                const data = await response.json();
                AdminController.allProducts = data;
                AdminController.renderProductsTable(data);
            }
        } catch (error) {
            console.error("Gagal memuat produk:", error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-10 text-center text-red-500 font-medium">
                        Terjadi kesalahan koneksi server.
                    </td>
                </tr>`;
        }
    },

    renderProductsTable: (products) => {
        const tbody = document.getElementById('products-tbody');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-10 text-center text-slate-400 font-medium">
                        Belum ada produk kue terdaftar di database.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = products.map(p => {
            const hasPromo = p.discount > 0;
            return `
                <tr class="border-b border-mandasari-gold/5 hover:bg-mandasari-cream/30 transition-colors">
                    <td class="py-4 px-6">
                        <img src="${p.image}" class="w-14 h-14 object-cover rounded-xl border border-slate-100" onerror="this.src='https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=100'">
                    </td>
                    <td class="py-4 px-6 font-bold text-sm text-mandasari-navy">${p.name}</td>
                    <td class="py-4 px-6 text-xs text-slate-500 uppercase tracking-widest font-semibold">${p.category}</td>
                    <td class="py-4 px-6 font-bold text-sm text-right">
                        ${hasPromo ? `
                            <span class="block text-[10px] text-slate-400 line-through">${Cart.formatCurrency(p.price)}</span>
                            <span class="text-rose-600">${Cart.formatCurrency(p.price - (p.price * (p.discount / 100)))}</span>
                        ` : Cart.formatCurrency(p.price)}
                    </td>
                    <td class="py-4 px-6 text-center font-semibold text-sm ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}">${p.stock}</td>
                    <td class="py-4 px-6 text-center text-xs">
                        ${p.badge ? `<span class="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px]">${p.badge}</span>` : ''}
                        ${hasPromo ? `<span class="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ml-1">-${p.discount}%</span>` : ''}
                        ${!p.badge && !hasPromo ? '-' : ''}
                    </td>
                    <td class="py-4 px-6 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="AdminController.openEditModal(${p.id})" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="AdminController.deleteProduct(${p.id})" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    openCreateModal: () => {
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('modal-title').textContent = 'Tambah Kue Baru';
        
        // Defaults
        document.getElementById('prod-discount').value = 0;
        document.getElementById('prod-rating').value = 5.0;

        document.getElementById('product-modal').classList.remove('hidden');
    },

    openEditModal: (id) => {
        const p = AdminController.allProducts.find(item => item.id === id);
        if (!p) return;

        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-stock').value = p.stock;
        document.getElementById('prod-category').value = p.category;
        document.getElementById('prod-badge').value = p.badge || '';
        document.getElementById('prod-image').value = p.image;
        document.getElementById('prod-discount').value = p.discount || 0;
        document.getElementById('prod-rating').value = p.rating || 5.0;
        document.getElementById('prod-description').value = p.description || '';

        document.getElementById('modal-title').textContent = 'Edit Kue Premium';
        document.getElementById('product-modal').classList.remove('hidden');
    },

    closeModal: () => {
        document.getElementById('product-modal').classList.add('hidden');
    },

    deleteProduct: async (id) => {
        const p = AdminController.allProducts.find(item => item.id === id);
        if (!p) return;

        if (!confirm(`Apakah Anda yakin ingin menghapus kue '${p.name}' dari database?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: Storage.getHeaders()
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (typeof Toast !== 'undefined') Toast.show(data.message, 'success');
                await AdminController.loadProducts();
            } else {
                if (typeof Toast !== 'undefined') Toast.show(data.message || 'Gagal menghapus produk.', 'error');
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            if (typeof Toast !== 'undefined') Toast.show('Terjadi kesalahan koneksi server.', 'error');
        }
    },

    handleFormSubmit: async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('prod-id').value;
        const name = document.getElementById('prod-name').value;
        const price = Number(document.getElementById('prod-price').value);
        const stock = Number(document.getElementById('prod-stock').value);
        const category = document.getElementById('prod-category').value;
        const badge = document.getElementById('prod-badge').value;
        const image = document.getElementById('prod-image').value;
        const discount = Number(document.getElementById('prod-discount').value);
        const rating = Number(document.getElementById('prod-rating').value);
        const description = document.getElementById('prod-description').value;

        const payload = {
            name, price, stock, category, badge, image, discount, rating, description
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`;

        try {
            const response = await fetch(url, {
                method,
                headers: Storage.getHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (typeof Toast !== 'undefined') Toast.show(data.message, 'success');
                AdminController.closeModal();
                await AdminController.loadProducts();
            } else {
                if (typeof Toast !== 'undefined') Toast.show(data.message || 'Gagal menyimpan kue.', 'error');
            }
        } catch (error) {
            console.error("Error saving product:", error);
            if (typeof Toast !== 'undefined') Toast.show('Gagal terhubung ke server.', 'error');
        }
    }
};

window.AdminController = AdminController;
document.addEventListener('DOMContentLoaded', AdminController.init);
