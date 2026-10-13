const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// GET semua pendaftar
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pendaftar');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST tambah pendaftar baru
router.post('/', async (req, res) => {
    try {
        const {
            nama, nim, email, telepon, universitas,
            fakultas, jurusan, ipk, alamat,
            norek, bank, pemilik_rekening
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO pendaftar 
            (nama, nim, email, telepon, universitas, fakultas, jurusan, ipk, alamat, norek, bank, pemilik_rekening) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nama, nim, email, telepon, universitas, fakultas, jurusan, ipk, alamat, norek, bank, pemilik_rekening]
        );

        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST unggah berkas
router.post('/berkas/:id', upload.fields([
    { name: 'ktp' }, { name: 'ktm' }, { name: 'kk' },
    { name: 'sk-aktif-kuliah' }, { name: 'sk-tidak-beasiswa' },
    { name: 'sktm' }, { name: 'transkrip-nilai' },
    { name: 'krs' }, { name: 'foto' }, { name: 'ukt' }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;

        await db.query(
            `UPDATE pendaftar SET 
            berkas_ktp=?, berkas_ktm=?, berkas_kk=?, berkas_sk_aktif=?,
            berkas_sk_tidak_beasiswa=?, berkas_sktm=?, berkas_transkrip=?,
            berkas_krs=?, berkas_foto=?, berkas_ukt=?
            WHERE id=?`,
            [
                files['ktp']?.[0]?.filename || null,
                files['ktm']?.[0]?.filename || null,
                files['kk']?.[0]?.filename || null,
                files['sk-aktif-kuliah']?.[0]?.filename || null,
                files['sk-tidak-beasiswa']?.[0]?.filename || null,
                files['sktm']?.[0]?.filename || null,
                files['transkrip-nilai']?.[0]?.filename || null,
                files['krs']?.[0]?.filename || null,
                files['foto']?.[0]?.filename || null,
                files['ukt']?.[0]?.filename || null,
                id
            ]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE hapus pendaftar
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM pendaftar WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST generate kode lolos beasiswa
router.post('/lolos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM pendaftar WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pendaftar tidak ditemukan.' });
        }

        const pendaftar = rows[0];
        const kode = `BSW-${pendaftar.nim}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        await db.query(
            `INSERT INTO lolos_beasiswa (pendaftar_id, kode, nim, nama, universitas, ipk, norek, bank, pemilik_rekening)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, kode, pendaftar.nim, pendaftar.nama, pendaftar.universitas,
             pendaftar.ipk, pendaftar.norek, pendaftar.bank, pendaftar.pemilik_rekening]
        );

        res.json({ success: true, kode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET semua lolos beasiswa
router.get('/lolos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM lolos_beasiswa');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE hapus lolos beasiswa
router.delete('/lolos/:kode', async (req, res) => {
    try {
        await db.query('DELETE FROM lolos_beasiswa WHERE kode = ?', [req.params.kode]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;