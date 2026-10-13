// script.js - hanya untuk halaman utama

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const btnClose = document.getElementById('btn-close');

if (hamburger && sidebar && btnClose) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
    });

    btnClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
    });
}

const btnTentangKami = document.querySelectorAll('.btn-teks');
btnTentangKami.forEach(btn => {
    if (btn.textContent.trim() === 'Tentang Kami') {
        btn.addEventListener('click', () => {
            const footer = document.querySelector('.footer');
            footer.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

const btnKontak = document.querySelectorAll('.btn-teks');
btnKontak.forEach(btn => {
    if (btn.textContent.trim() === 'Kontak') {
        btn.addEventListener('click', () => {
            const footer = document.querySelector('.footer');
            footer.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

const formPendaftaran = document.getElementById('form-pendaftaran');
if (formPendaftaran) {
    formPendaftaran.addEventListener('submit', (e) => {
        e.preventDefault();

        const dataPendaftar = {
            id: Date.now(),
            nama: document.getElementById('nama').value,
            nim: document.getElementById('nim').value,
            email: document.getElementById('email').value,
            telepon: document.getElementById('telepon').value,
            universitas: document.getElementById('universitas').value,
            fakultas: document.getElementById('fakultas').value,
            jurusan: document.getElementById('jurusan').value,
            ipk: document.getElementById('ipk').value,
            alamat: document.getElementById('alamat').value,
            norek: document.getElementById('norek').value,
            bank: document.getElementById('bank').value,
            pemilikRekening: document.getElementById('pemilik-rekening').value,
            berkas: null
        };

        const dataSudahAda = JSON.parse(localStorage.getItem('pendaftar')) || [];
        dataSudahAda.push(dataPendaftar);
        localStorage.setItem('pendaftar', JSON.stringify(dataSudahAda));
        localStorage.setItem('id-sementara', dataPendaftar.id);

        document.querySelector('.formulir').style.display = 'none';
        document.querySelector('.unggah-berkas').style.display = 'block';

        alert('Data pendaftaran berhasil disimpan! Silakan unggah berkas.');
    });
}

const formBerkas = document.getElementById('form-berkas');
if (formBerkas) {
    formBerkas.addEventListener('submit', (e) => {
        e.preventDefault();

        const idSementara = parseInt(localStorage.getItem('id-sementara'));
        const dataSudahAda = JSON.parse(localStorage.getItem('pendaftar')) || [];
        const index = dataSudahAda.findIndex(p => p.id === idSementara);

        if (index === -1) {
            alert('Terjadi kesalahan, data pendaftaran tidak ditemukan.');
            return;
        }

        dataSudahAda[index].berkas = {
            ktp: document.getElementById('ktp').files[0]?.name || '-',
            ktm: document.getElementById('ktm').files[0]?.name || '-',
            kk: document.getElementById('kk').files[0]?.name || '-',
            skAktif: document.getElementById('sk-aktif-kuliah').files[0]?.name || '-',
            skTidakBeasiswa: document.getElementById('sk-tidak-beasiswa').files[0]?.name || '-',
            sktm: document.getElementById('sktm').files[0]?.name || '-',
            transkrip: document.getElementById('transkrip-nilai').files[0]?.name || '-',
            krs: document.getElementById('krs').files[0]?.name || '-',
            foto: document.getElementById('foto').files[0]?.name || '-',
            ukt: document.getElementById('ukt').files[0]?.name || '-',
        };

        localStorage.setItem('pendaftar', JSON.stringify(dataSudahAda));
        localStorage.removeItem('id-sementara');

        alert('Berkas berhasil diunggah! Pendaftaran selesai.');
        document.querySelector('.unggah-berkas').style.display = 'none';
        document.querySelector('.formulir').style.display = 'block';
        formBerkas.reset();
    });
}

// LOGIN ADMIN
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'adminkesra' && password === 'kotakupang') {
            window.location.href = 'admin_dashboard.html';
        } else {
            document.getElementById('pesan-error').style.display = 'block';
        }
    });
}

//KEMBALI KE HALAMAN UTAMA
const btnKembali = document.getElementById('btn-kembali');
if (btnKembali) {
    btnKembali.addEventListener('click', () => {
        window.location.href = 'pendaftar.html';
    });
}