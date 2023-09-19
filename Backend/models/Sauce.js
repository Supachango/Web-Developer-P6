const mongoose = require('mongoose');
// Il s'agit du modèle de donnée de Mongo DB

// Création de schémas pour les enregistrements dans la base de donnée
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true},
    // configuration de required = champs requis obligatoirement
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    userId: { type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: true, default: 0},
    dislikes: {type: Number, required: true, default: 0},
    //création de tableaux vides
    usersLiked: { type: [], required: true, default: []},
    usersDisliked: { type: [], required: true, default: []},  
});

module.exports = mongoose.model('Sauce', sauceSchema);
// export du schémas de modèle avec comme arguments: le titre et le schéma de donnée


