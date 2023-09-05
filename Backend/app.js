const express = require('express');
const app = express();
const mongoose = require('mongoose');
// Mongoose est un package qui facilite les interactions avec la base de données
const stuffRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');
const path = require('path');
let cors = require("cors");
require('dotenv').config()
app.use(cors());
// règlage Sécurité du CORS :  cross origin ressource sharing (voir plus bas)


mongoose.connect(process.env.MONGO_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
// = BODY PARSER 
// Middleware qui intercepte les requetes contenant du JSON et donne accès au corps de la requète


app.use((req, res, next) => {
  // Règlage du CORS :  Sécurité cross origin ressource sharing : Autorise tout le monde à faire des requètes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/sauces', stuffRoutes);
// url abrégée de l'endpoint de la route pour les objets sauces
app.use('/api/auth', userRoutes);
// url abrégée de l'endpoint de la route authentification
app.use('/images', express.static(path.join(__dirname, 'images')));
// url abrégée de l'endpoint de la route pour l'enregistrement des images


module.exports = app;