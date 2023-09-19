const mongoose = require ('mongoose');

const uniqueValidator = require ('mongoose-unique-validator');
    //ici les informationn de l'utilisateur pour la connexion à la bdd

const userSchema = mongoose.Schema({
    //ici le modèle de schéma pour les utilisateurs du site
    email: { type: String, requiered: true, unique: true},
    password: { type: String, requiered: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
