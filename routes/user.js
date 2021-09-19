const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profil', userCtrl.getProfil);

// route.get /profil ou on retrouve les infos mot de passe et le mail en maské 
//apres on va dans controller

module.exports = router;