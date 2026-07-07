/**
 * Mandasari Premium App - Core Logic
 */

const MandasariApp = {
    init: () => {
        MandasariApp.handleNavbarScroll();
        MandasariApp.initDropdownSystem();
        MandasariApp.updateFooterYear();
        
        // Inisialisasi Tooltip atau inisialisasi awal lainnya jika diperlukan
        console.log("Mandasari App Initialized...");
    },

    // Mengatur efek transparan ke solid pada Navbar saat scroll
    handleNavbarScroll: () => {
        const header = document.getElementById('navbar');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                // Efek saat scroll ke bawah
                header.classList.add('glass-nav', 'shadow-sm');
                header.style.paddingTop = '0.75rem';
                header.style.paddingBottom = '0.75rem';
            } else {
                // Efek saat di posisi paling atas
                header.classList.remove('glass-nav', 'shadow-sm');
                header.style.paddingTop = '1.25rem';
                header.style.paddingBottom = '1.25rem';
            }
        });
    },

    // Sistem Dropdown yang cerdas dan menutup otomatis
    initDropdownSystem: () => {
        document.addEventListener('click', (event) => {
            const isDropdownButton = event.target.closest('.dropdown-trigger');
            const currentDropdown = event.target.closest('.dropdown-container');

            // Tutup semua dropdown jika klik di luar area dropdown
            if (!isDropdownButton && !currentDropdown) {
                document.querySelectorAll('.dropdown-content').forEach(d => {
                    d.classList.add('opacity-0', 'invisible', 'translate-y-2');
                });
                return;
            }

            // Jika tombol dropdown diklik
            if (isDropdownButton) {
                const content = isDropdownButton.parentElement.querySelector('.dropdown-content');
                
                // Tutup dropdown lain yang mungkin sedang terbuka
                document.querySelectorAll('.dropdown-content').forEach(other => {
                    if (other !== content) {
                        other.classList.add('opacity-0', 'invisible', 'translate-y-2');
                    }
                });

                // Toggle menu saat ini
                content.classList.toggle('opacity-0');
                content.classList.toggle('invisible');
                content.classList.toggle('translate-y-2');
            }
        });
    },

    // Update tahun hak cipta secara otomatis
    updateFooterYear: () => {
        const yearDisplay = document.getElementById('footer-year');
        if (yearDisplay) {
            yearDisplay.textContent = new Date().getFullYear();
        }
    },

    /**
     * Helper: Format tanggal Indonesia (Contoh: 21 April 2026)
     */
    formatDate: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
};

// Daftarkan ke global window
window.App = MandasariApp;

// Start App
document.addEventListener('DOMContentLoaded', MandasariApp.init);