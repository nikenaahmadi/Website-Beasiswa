const express = require('express');
const router = express.Router();

const ADMIN_USERNAME = 'martinjabrik';
const ADMIN_PASSWORD = 'jamesfineshyt';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Username atau password salah.' });
    }
});

module.exports = router;