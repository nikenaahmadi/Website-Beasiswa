// admin.js

let idAktif = null;

function tampilkanData() {
    const dataPendaftar = JSON.parse(localStorage.getItem('pendaftar')) || [];
    const tbody = document.querySelector('#tabel-pendaftar tbody');

    if (dataPendaftar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada data pendaftar.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    dataPendaftar.forEach((pendaftar, index) => {
        const baris = document.createElement('tr');
        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${pendaftar.nim}</td>
            <td>${pendaftar.nama}</td>
            <td>
                <button class="btn-lihat" onclick="lihatBerkas(${pendaftar.id})">Lihat Berkas</button>
                <button class="btn-hapus" onclick="hapusData(${pendaftar.id})">Hapus</button>
            </td>
        `;
        tbody.appendChild(baris);
    });
}

function hapusData(id) {
    const konfirmasi = confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!konfirmasi) return;

    let dataPendaftar = JSON.parse(localStorage.getItem('pendaftar')) || [];
    dataPendaftar = dataPendaftar.filter(p => p.id !== id);
    localStorage.setItem('pendaftar', JSON.stringify(dataPendaftar));

    alert('Data berhasil dihapus.');
    tampilkanData();
}

function lihatBerkas(id) {
    idAktif = id;
    const dataPendaftar = JSON.parse(localStorage.getItem('pendaftar')) || [];
    const pendaftar = dataPendaftar.find(p => p.id == id);

    if (!pendaftar) return;

    document.getElementById('d-nama').textContent = pendaftar.nama;
    document.getElementById('d-nim').textContent = pendaftar.nim;
    document.getElementById('d-email').textContent = pendaftar.email;
    document.getElementById('d-telepon').textContent = pendaftar.telepon;
    document.getElementById('d-universitas').textContent = pendaftar.universitas;
    document.getElementById('d-fakultas').textContent = pendaftar.fakultas;
    document.getElementById('d-jurusan').textContent = pendaftar.jurusan;
    document.getElementById('d-ipk').textContent = pendaftar.ipk;
    document.getElementById('d-alamat').textContent = pendaftar.alamat;
    document.getElementById('d-norek').textContent = pendaftar.norek;
    document.getElementById('d-bank').textContent = pendaftar.bank;
    document.getElementById('d-pemilik').textContent = pendaftar.pemilikRekening;

    const berkas = pendaftar.berkas;
    if (berkas) {
        document.getElementById('d-ktp').textContent = berkas.ktp;
        document.getElementById('d-ktm').textContent = berkas.ktm;
        document.getElementById('d-kk').textContent = berkas.kk;
        document.getElementById('d-skaktif').textContent = berkas.skAktif;
        document.getElementById('d-sktidak').textContent = berkas.skTidakBeasiswa;
        document.getElementById('d-sktm').textContent = berkas.sktm;
        document.getElementById('d-transkrip').textContent = berkas.transkrip;
        document.getElementById('d-krs').textContent = berkas.krs;
        document.getElementById('d-foto').textContent = berkas.foto;
        document.getElementById('d-ukt').textContent = berkas.ukt;
    } else {
        ['d-ktp','d-ktm','d-kk','d-skaktif','d-sktidak',
         'd-sktm','d-transkrip','d-krs','d-foto','d-ukt'].forEach(elId => {
            document.getElementById(elId).textContent = 'Belum diunggah';
        });
    }

    document.getElementById('modal-overlay').style.display = 'flex';
}

function generateKode() {
    const dataPendaftar = JSON.parse(localStorage.getItem('pendaftar')) || [];
    const pendaftar = dataPendaftar.find(p => p.id == idAktif);

    if (!pendaftar) {
        alert('Data pendaftar tidak ditemukan.');
        return;
    }

    const dataLolos = JSON.parse(localStorage.getItem('lolos-beasiswa')) || [];
    const sudahLolos = dataLolos.find(p => p.id == idAktif);
    if (sudahLolos) {
        alert(`Pendaftar ini sudah memiliki kode: ${sudahLolos.kode}`);
        return;
    }

    const kode = `BSW-${pendaftar.nim}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const dataLolosEntry = {
        id: pendaftar.id,
        kode: kode,
        nim: pendaftar.nim,
        nama: pendaftar.nama,
        universitas: pendaftar.universitas,
        ipk: pendaftar.ipk,
        norek: pendaftar.norek,
        bank: pendaftar.bank,
        pemilikRekening: pendaftar.pemilikRekening
    };

    dataLolos.push(dataLolosEntry);
    localStorage.setItem('lolos-beasiswa', JSON.stringify(dataLolos));

    alert(`✅ Kode berhasil digenerate: ${kode}`);
    tutupModal();
    tampilkanLolos();
}

function tampilkanLolos() {
    const dataLolos = JSON.parse(localStorage.getItem('lolos-beasiswa')) || [];
    const tbody = document.querySelector('#tabel-lolos tbody');

    if (dataLolos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Belum ada penerima beasiswa.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    dataLolos.forEach((item, index) => {
        const baris = document.createElement('tr');
        baris.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.kode}</strong></td>
            <td>${item.nim}</td>
            <td>${item.nama}</td>
            <td>${item.universitas}</td>
            <td>${item.ipk}</td>
            <td><button class="btn-hapus-lolos" onclick="hapusLolos('${item.kode}')">Hapus</button></td>
        `;
        tbody.appendChild(baris);
    });
}

function hapusLolos(kode) {
    const konfirmasi = confirm('Apakah Anda yakin ingin menghapus data penerima beasiswa ini?');
    if (!konfirmasi) return;

    let dataLolos = JSON.parse(localStorage.getItem('lolos-beasiswa')) || [];
    dataLolos = dataLolos.filter(p => p.kode !== kode);
    localStorage.setItem('lolos-beasiswa', JSON.stringify(dataLolos));

    alert('Data penerima beasiswa berhasil dihapus.');
    tampilkanLolos();
}

function tutupModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    idAktif = null;
}

// event listeners
document.getElementById('btn-generate').addEventListener('click', generateKode);

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) {
        tutupModal();
    }
});

// jalankan saat halaman dibuka
tampilkanData();
tampilkanLolos();