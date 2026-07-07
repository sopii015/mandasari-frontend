/**
 * Mandasari Premium - Katalog Produk & Logika Filter
 */

const KatalogMandasari = {
    semuaProduk: [],

    init: async () => {
        const data = await KatalogMandasari.muatDataJson();
        if (data && data.length > 0) {
            const featuredGrid = document.getElementById('featured-grid');
            if (featuredGrid) {
                const produkUnggulan = KatalogMandasari.ambilProdukUnggulan(4);
                KatalogMandasari.render(produkUnggulan, 'featured-grid');
            }

            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
                KatalogMandasari.render(data, 'product-grid');
            }
        }
    },

    muatDataJson: async () => {
        try {
            // Memanggil API Backend
            const response = await fetch(`${API_BASE_URL}/api/products`);
            if (!response.ok) throw new Error('Gagal mengambil data produk');
            
            const data = await response.json();
            KatalogMandasari.semuaProduk = data;
            
            window.dispatchEvent(new Event('katalog-siap'));
            return data;
        } catch (error) {
            console.error('Error Katalog:', error);
            // Fallback ke local data/products.json jika backend offline saat testing frontend
            try {
                const response = await fetch('data/products.json');
                if (response.ok) {
                    const data = await response.json();
                    KatalogMandasari.semuaProduk = data;
                    window.dispatchEvent(new Event('katalog-siap'));
                    return data;
                }
            } catch (fallbackError) {
                console.error('Fallback Error:', fallbackError);
            }
            return [];
        }
    },

    render: (produkArray, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (produkArray.length === 0) {
            container.innerHTML = '<p class="col-span-full text-center text-slate-500 py-10 font-light">Kue tidak ditemukan...</p>';
            return;
        }

        container.innerHTML = produkArray.map(p => KatalogMandasari.generateCardHTML(p)).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    ambilProdukUnggulan: (limit = 4) => {
        let unggulan = KatalogMandasari.semuaProduk.filter(p => p.badge === 'Best Seller' || p.discount > 0);
        
        if (unggulan.length < limit) {
            const produkLainnya = KatalogMandasari.semuaProduk.filter(p => p.badge !== 'Best Seller' && (p.discount === 0 || !p.discount));
            unggulan = [...unggulan, ...produkLainnya];
        }
        
        return unggulan.slice(0, limit);
    },

    ambilBerdasarkanId: (id) => {
        return KatalogMandasari.semuaProduk.find(p => p.id === parseInt(id));
    },

    // Logika Wishlist & Keranjang dengan Notifikasi Cantik
    handleAksi: async (id, jenis) => {
        if (!Auth.isLoggedIn()) {
            if (window.Toast) {
                Toast.show(`Silahkan login dulu untuk simpan ${jenis}!`, 'warning');
            }
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            return;
        }

        const produk = KatalogMandasari.ambilBerdasarkanId(id);

        if (jenis === 'Wishlist') {
            if (window.Wishlist) {
                await window.Wishlist.toggle(produk.id);
            }
        } else {
            if (window.KeranjangMandasari) {
                await window.KeranjangMandasari.tambahProduk(produk);
            } else if (window.Cart) {
                await window.Cart.tambahProduk(produk);
            }
        }
    },

    generateCardHTML: (produk) => {
        const adaDiskon = produk.discount > 0;
        const hargaDiskon = adaDiskon ? produk.price - (produk.price * (produk.discount / 100)) : produk.price;
        const formatIDR = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        
        let labelHtml = '';
        if (produk.badge) {
            const warnaBadge = produk.badge === 'Best Seller' ? 'bg-amber-500' : 'bg-blue-600';
            labelHtml = `<span class="absolute top-3 left-3 px-3 py-1 ${warnaBadge} text-white text-[10px] font-black uppercase rounded-full z-10 shadow-lg">${produk.badge}</span>`;
        } else if (adaDiskon) {
            labelHtml = `<span class="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-full z-10 shadow-lg">PROMO ${produk.discount}%</span>`;
        }

        const isFav = window.Wishlist && typeof window.Wishlist.apakahFavorit === 'function' && window.Wishlist.apakahFavorit(produk.id);

        return `
            <div class="group relative bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                ${labelHtml}
                <button onclick="event.preventDefault(); KatalogMandasari.handleAksi(${produk.id}, 'Wishlist')" 
                        class="btn-wishlist absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-md transition-all active:scale-90 ${isFav ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}">
                    <i data-lucide="heart" class="w-5 h-5 ${isFav ? 'fill-current' : ''}"></i>
                </button>

                <a href="product-detail.html?id=${produk.id}" class="block aspect-[4/5] overflow-hidden bg-slate-50">
                    <img src="${produk.image}" alt="${produk.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onerror="this.src='https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500'">
                </a>
                
                <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${produk.category || 'Cake'}</span>
                        <div class="flex items-center text-amber-500 text-[11px] font-bold">
                            <i data-lucide="star" class="w-3 h-3 fill-current mr-1"></i> ${produk.rating || '5.0'}
                        </div>
                    </div>
                    <a href="product-detail.html?id=${produk.id}" class="block text-mandasari-navy font-bold text-lg mb-4 hover:text-mandasari-gold transition-colors line-clamp-1">${produk.name}</a>
                    <div class="flex items-center justify-between">
                        <div>
                            ${adaDiskon ? `
                                <span class="block text-[10px] text-slate-400 line-through">${formatIDR(produk.price)}</span>
                                <span class="text-lg font-black text-rose-600">${formatIDR(hargaDiskon)}</span>
                            ` : `
                                <span class="text-lg font-black text-mandasari-navy">${formatIDR(produk.price)}</span>
                            `}
                        </div>
                        <button onclick="event.preventDefault(); KatalogMandasari.handleAksi(${produk.id}, 'Keranjang')" 
                                class="h-10 w-10 rounded-xl bg-mandasari-navy text-white flex items-center justify-center hover:bg-mandasari-gold transition-all shadow-lg active:scale-95">
                            <i data-lucide="plus" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.KatalogMandasari = KatalogMandasari;
KatalogMandasari.init();