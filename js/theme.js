/**
 * Mandasari Premium - Theme Switcher Logic
 */

const TemaMandasari = {
    init: () => {
        // Terapkan tema yang tersimpan saat halaman dimuat
        TemaMandasari.terapkanTema();
        
        // Pasang event listener ke semua tombol toggle (Desktop & Mobile)
        const toggleButtons = document.querySelectorAll('.btn-toggle-tema, #toggle-tema-utama');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                TemaMandasari.gantiTema();
            });
        });
    },

    /**
     * Mengambil preferensi tema dari storage
     */
    ambilTemaAktif: () => {
        // Default ke 'light' untuk tampilan toko kue yang lebih fresh & bersih
        return Storage.get(STORAGE_KEYS.THEME) || 'light';
    },

    /**
     * Logika untuk menerapkan class CSS ke element root (HTML)
     */
    terapkanTema: () => {
        const tema = TemaMandasari.ambilTemaAktif();
        const root = document.documentElement;
        
        // Ikon SVG untuk indikator visual
        const iconBulan = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        const iconMatahari = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

        const allIcons = document.querySelectorAll('.icon-tema-visual');

        if (tema === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            allIcons.forEach(icon => icon.innerHTML = iconMatahari);
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
            allIcons.forEach(icon => icon.innerHTML = iconBulan);
        }
    },

    /**
     * Fungsi untuk mengganti tema (toggle)
     */
    gantiTema: () => {
        const temaSekarang = TemaMandasari.ambilTemaAktif();
        const temaBaru = temaSekarang === 'light' ? 'dark' : 'light';
        
        // Simpan preferensi ke LocalStorage
        Storage.set(STORAGE_KEYS.THEME, temaBaru);
        
        // Terapkan perubahan ke UI
        TemaMandasari.terapkanTema();
        
        // Feedback visual menggunakan Toast
        if (typeof Toast !== 'undefined') {
            const pesan = temaBaru === 'dark' ? 'Mode Malam Aktif' : 'Mode Terang Aktif';
            Toast.show(pesan, 'info', 1500);
        }
    }
};

// Inisialisasi saat struktur DOM selesai dimuat
document.addEventListener('DOMContentLoaded', TemaMandasari.init);