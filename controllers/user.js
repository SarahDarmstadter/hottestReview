const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');

exports.signup = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{6,15})$/gm;
    const regexEmail = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/gm;

    if (password.match(regexPassword) && email.match(regexEmail)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur crée' }))
                    .catch(error => res.status(500).json({ error }))
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        throw "Le mot doit contenir entre 8 et 15 caractères, au moins une majuscule, un chiffre et un caractère spécial. Et l'email doit être valide."
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'utilisateur non trouvé' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'mot de passe invalide' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

exports.getProfil = (req, res, next) => {
    const emailMask2Options = {
        maskWith: "*",
        unmaskedStartCharactersBeforeAt: 3,
        unmaskedEndCharactersAfterAt: 2,
        maskAtTheRate: false
    };

    const email = req.body.email;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

    User.findOne({ email: req.body.email })
        .then(user => {
            user.email = maskedEmail
            user.password = "****"
            res.status(200)
                .json(user)
                .console.log(user)
        })
        .catch(error => res.status(404).json({ error }))
};








