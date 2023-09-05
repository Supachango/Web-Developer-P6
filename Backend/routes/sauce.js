const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucectrl = require('../controllers/sauce');

router.get('/', auth, saucectrl.getAllSauces);
router.post('/', auth, multer, saucectrl.createSauce);
router.get('/:id', auth, saucectrl.getOneSauce);
//permet la lecture et l'écriture d'un objet, ici une sauce
router.put('/:id', auth, multer, saucectrl.modifySauce);
//permet la modification d'un objet, ici la sauce
router.delete('/:id', auth, saucectrl.deleteSauce);
//permet la suppression d'un objet, ici la sauce
router.post('/:id/like', auth, saucectrl.addlike);
// les deux points indiquent à Express que c'est un paramètre de route dynamique

module.exports = router;
