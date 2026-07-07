/**
 * Mandasari Premium - Sistem Notifikasi (Toast)
 */

const PesanToast = {
    wadah: null,

    init: () => {
        // Buat kontainer toast jika belum ada di dalam HTML
        let toastContainer = document.getElementById('mandasari-toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'mandasari-toast-container';
            // Class ini bisa Anda styling di CSS untuk posisi (misal: bottom-right)
            toastContainer.className = 'fixed bottom-5 right-5 z-[100] flex flex-col gap-3';
            document.body.appendChild(toastContainer);
        }
        
        PesanToast.wadah = toastContainer;
    },

    /**
     * Menampilkan notifikasi ke layar
     * @param {string} pesan - Teks yang ingin disampaikan
     * @param {string} tipe - Kategori: 'success', 'error', 'warning', 'info'
     * @param {number} durasi - Waktu tampil dalam milidetik
     */
    tampilkan: (pesan, tipe = 'info', durasi = 3000) => {
        if (!PesanToast.wadah) PesanToast.init();

        const toast = document.createElement('div');
        // Styling menggunakan Tailwind/Custom CSS classes
        toast.className = `toast-item toast-${tipe} flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 animate-slide-in`;
        
        // Pemetaan Ikon untuk setiap tipe pesan
        let ikonSvg = '';
        switch(tipe) {
            case 'success':
                ikonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
                break;
            case 'error':
                ikonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
                break;
            case 'warning':
                ikonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
                break;
            default: // info
                ikonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }

        toast.innerHTML = `
            <div class="flex-shrink-0">${ikonSvg}</div>
            <span class="text-sm font-bold text-slate-800">${pesan}</span>
        `;

        PesanToast.wadah.appendChild(toast);

        // Hapus otomatis setelah durasi tercapai
        setTimeout(() => {
            toast.classList.add('animate-slide-out');
            toast.addEventListener('animationend', () => {
                if (toast.parentNode === PesanToast.wadah) {
                    PesanToast.wadah.removeChild(toast);
                }
            });
        }, durasi);
    }
};

// Hubungkan ke variabel global agar bisa dipanggil oleh file JS lain (misal: Cart.js)
window.Toast = {
    show: PesanToast.tampilkan
};

// Jalankan inisialisasi saat halaman siap
document.addEventListener('DOMContentLoaded', PesanToast.init);