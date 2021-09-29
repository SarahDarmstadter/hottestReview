// Fichier de création du router qui contient les fonctions s'appliquant aux différentes routes pour les users

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profil', userCtrl.getProfil);


module.exports = router;