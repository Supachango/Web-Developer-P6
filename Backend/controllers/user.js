const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    // fonction pour créer un utilisateur
    bcrypt.hash(req.body.password, 10)
    // chiffre le mot de passe
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                // la requete est bien passée et la création de l'objet user dans la bdd est bien enregistrée
                .catch(error => res.status(400).json({ message: 'Cet utilisateur existe déjà' }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    // fonction pour authentifier un utilisateur
    User.findOne({ email: req.body.email })
        // la méthode find one cherche l'email dans le corps de la requète
        .then(user => {
            if (!user) {
                // ! est une négation logique. Il remplace === null
                return res.status(401).json({ error: 'Paire identifiant mot de passe incorrecte !' });
            }
            bcrypt.compare(req.body.password, user.password)
            // cette méthode permet de comparer le mot de passe de la bdd avec celui qui vient d'être transmis. 
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire identifiant identifiant/mot de passe incorrecte ' });
                        // C'est le même message. Evite les fuites de donnée : On ne sait pas si l'utilisateur existe déjà ou si le mot de passe est incorrect.
                    }
                    res.status(200).json({
                        userId: user._id,
                        // second cas : l'utilisateur existe : On donne un TOKEN = Signature
                        token: jwt.sign(
                        // Le package jsonwebtocken permet de vérifier les infos de connexions au site.
                        // On l'importe en haut de page    
                            { userId: user._id },
                            //met l'user id dans le tocken
                            process.env.AUTH_TOKEN,
                            { expiresIn: '15m' }
                            
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };