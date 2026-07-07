# Mandasari Kue - Premium Cake Shop System 🍰✨

## 📝 Deskripsi Project
**Mandasari Kue** adalah platform e-commerce modern yang dikhususkan untuk penjualan produk kue premium seperti brownies dan bakpia. Proyek ini dibangun untuk memenuhi kriteria penilaian UTS mata kuliah Pemrograman Web 2 dengan fokus pada antarmuka yang bersih (*clean*), elegan, dan sepenuhnya responsif menggunakan **Tailwind CSS**.

Seluruh logika utama aplikasi dikembangkan menggunakan **Vanilla JavaScript (ES6+)** dengan memanfaatkan **LocalStorage** sebagai media penyimpanan data lokal (*persistent state*) dan **Fetch API** untuk mengelola data katalog dari file JSON. Aplikasi ini dirancang untuk memberikan pengalaman belanja yang mewah bagi pengguna dengan skema warna *Navy*, *Gold*, dan *Cream*.

---

## 🛠️ Fitur Utama

Aplikasi ini dilengkapi dengan fungsionalitas komprehensif yang mencakup fitur wajib UTS serta fitur tambahan (bonus) sebagai berikut:

* **Sistem Otentikasi (Auth)**: Fitur Login dan Register dengan validasi email unik dan minimal password 6 karakter. Dilengkapi sistem *Log Out* untuk mengakhiri sesi.
* **Smart Shop Guard**: Sistem proteksi otomatis yang mengarahkan user ke halaman login jika mencoba melakukan aksi belanja (tambah keranjang/wishlist) tanpa status login.
* **Manajemen Keranjang (Cart)**: Fitur tambah, kurang, dan hapus produk secara dinamis dengan kalkulasi total harga otomatis secara real-time.
* **Pencarian & Filter Pintar**: Fitur pencarian produk berdasarkan nama dan filter kategori (Single Select) untuk memudahkan navigasi produk.
* **Checkout & Riwayat Pesanan**: Simulasi transaksi dengan form detail pengiriman, pembuatan ID Transaksi unik otomatis, dan halaman khusus untuk memantau riwayat pembelian.
* **Wishlist (Fitur Bonus)**: Memungkinkan pengguna menyimpan produk favorit ke dalam daftar tersendiri.
* **Custom Toast Notification (Fitur Bonus)**: Penggunaan notifikasi kustom yang elegan untuk memberikan *feedback* kepada pengguna (berhasil/gagal).
* **Pagination (Fitur Bonus)**: Navigasi halaman pada katalog produk untuk menjaga kerapihan tata letak saat produk bertambah banyak.

---

## ⚙️ Cara Menjalankan (Local Development)

Karena proyek ini menggunakan Fetch API untuk mengambil data dari file `products.json`, sangat disarankan untuk menjalankannya melalui web server lokal guna menghindari kendala kebijakan CORS:

1.  **Clone atau Download**: Unduh seluruh file proyek ini ke komputer Anda.
2.  **Buka di Teks Editor**: Masukkan folder proyek ke dalam teks editor seperti Visual Studio Code.
3.  **Gunakan Live Server**: 
    * Instal ekstensi **Live Server** di VS Code.
    * Klik kanan pada file `index.html`.
    * Pilih **"Open with Live Server"**.
4.  **Akses Aplikasi**: Browser akan otomatis terbuka dan aplikasi siap digunakan pada alamat `http://127.0.0.1:5500`.

---

## 🔗 Link Demo (GitHub Pages)

Aplikasi ini telah dideploy secara online dan dapat diakses secara publik melalui tautan berikut:

👉 **https://sopii015.github.io/Sopia_Salsabila_UTS_WEB2/**

---
