const express = require('express');

const helmet = require('helmet');
//Helmet permet d'installer des entêtes sécurisées pour l'application

const rateLimit = require('express-rate-limit');
//Rate-limiter est un module qui permet de controler le nombre de requète qu'un utilisateur fait sur le site

const app = express();

const stuffRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');
const path = require('path');
let cors = require("cors");
require('dotenv').config()
app.use(cors());
// règlage Sécurité du CORS :  cross origin ressource sharing (voir plus bas)


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



//utiliser helmet comme middleware
app.use(helmet());

// Config rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 100, // 100 requêtes maximum par heure
  message: 'Trop de requêtes de votre adresse IP. Veuillez réessayer plus tard.'
});

app.use(limiter);

module.exports = app;