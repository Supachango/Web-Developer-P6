const Sauce = require('../models/Sauce');
// fonction appel du package pour la gestion des fichiers
const fs = require('fs'); 

//----------------------------------------------------------------------------Création de l'objet Sauce
exports.createSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce);
    delete SauceObject._id;
    // supprime car il y a un _id généré automatiquement par Mongo DB 
    delete SauceObject._userId; 
    // Prend l'id du token pas celui de l'utilisateur
    const newSauce = new Sauce({
        ...SauceObject,
        //l'opérateur SPREAD ici abrege la création d'objet (cf models Sauce)
        //  const newSauce = new Thing
        //      name: req.body.name,
        //      description : req.body.description,
        //      mainpeper : req.body.mainpeper,
        //      imageURL: req.body.imageURL,
        //      X userId : req.body.userId,
        //      heat: ...
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename}`,
    }); 

    newSauce.save()
    .then(() => { res.status(201).json({message: "Sauce enregistrée !"})})
    // indique la bonne création de ressource
    .catch(error => 
        {res.status(400).json( {error })
    })
};
  
//------------------------------------------------------------------------Modification de l'objet Sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        //récupération des données sur l'objet' sauce
        // Le point d'intérgation est une expression conditionnelle
            //Si req.file est défini, on créer un nouvel objet et gérer le fichier image
            //Si req.file n'est pas défini, on copie l'objet sauce
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    // suprrime l'utilisateur pour sécuriser
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                // ici on vérifie que ll'utlisateur est l'auteur de la sauce.
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                //Met à jour le texte ou met à jour le texte et l'image
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


//-----------------------------------------------------------------------Supprimer l'objet une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            // Méthode split : Divise la chaine de caractère en deux éléments de tableaux.
            // On accède au deuxième élément à l'indice 1
            fs.unlink(`images/${filename}`, () => {
            //File System est un module Node.js qui permet d'interagir avec le système de fichiers du système d'exploitation
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};
//---------------------------------------------------------------------------------------Voir une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};
//----------------------------------------------------------Récupération de l'objet : Toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  };



//--------------------------------------------------------------------------------------Ajouter un like
exports.addlike = (req, res, next) => {
    const userId = req.auth.userId
    const vote = req.body.like

    if(vote == 1){
        Sauce.updateOne(
            {_id:req.params.id},
            {$inc:{likes:+1},$push:{usersLiked:userId}}
            )
            .then(() => res.status(200).json({ message: "Sauce likée !" }))
            .catch((error) => res.status(400).json({ error }));
    } 
    else if(vote == -1){
        Sauce.updateOne(
            {_id:req.params.id},
            {$inc:{dislikes:+1},$push:{usersDisliked:userId}}
            )
            .then(() => res.status(200).json({ message: "Sauce dislikée !" }))
            .catch((error) => res.status(400).json({ error }));
        
    }
    else if(vote == 0){
        Sauce.findOne({ _id: req.params.id})
        // On est obligé de chercher dans la sauce si l'utilisateur est dans like ou dislike
        .then(sauce => {
            if (sauce.usersLiked.find(id => id == userId)){
                Sauce.updateOne(
                    {_id:req.params.id},
                    {$inc:{likes:-1},$pull:{usersLiked:userId}}
                    // on enlève un vote
                    )
                    .then(() => res.status(200).json({ message: "Vote supprimé !" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.find(id => id == userId)){
                Sauce.updateOne(
                    {_id:req.params.id},
                    {$inc:{dislikes:-1},$pull:{usersDisliked:userId}}
                    // on enlève un vote
                    )
                    .then(() => res.status(200).json({ message: "Vote supprimé !" }))
                    .catch((error) => res.status(400).json({ error }));
            }

        })
    }
}

