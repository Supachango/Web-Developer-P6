const multer = require('multer');
// import du module multer qui gère les téléchargements dans les applications express

const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    //méthode de configuration de stockage
    destination: (req, file, callback) =>{
        callback(null, 'images')
        // à quel endroit il sera stocké
    },
    filemane: (req, file, callback) => {
        const name = file.originalname.split (' ').join('_');
        const extension = MINE_TYPES[file.minetype];
        callback(null, name + Date.now()+'.'+extension);
        //avec quel nom = extention + horodatage

    }
});

module.exports = multer({ storage }).single('image');
