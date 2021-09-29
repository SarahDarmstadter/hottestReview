// Fichier de toute la logique métier des modèles

//Importation du modele de sauce
const Sauce = require('../models/Sauce');

//Importation de file system(fs) pour ne pas saturer le serveur de fichiers inutiles après suppression ou modification
const fs = require('fs');


exports.createSauce =  (req, res, next) => {
//Les données du frontend sont sous format form-data, on les convertit en Js
    const sauceObject = JSON.parse(req.body.sauce);
//on supprime l'id généré par MongoDB pour pouvoir créer une nouvelle instance du modele sauce qui ne contient pas l'id
    delete sauceObject._id;
    const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
            likes : 0,
            dislikes: 0,
            userLiked : [],
            userDisliked : []
        });
         sauce.save()
        .then(()=> res.status(201).json({message : 'sauce enregistrée'}))
        .catch(error => res.status(400).json({ error 
      })); 
      };

exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    } : 
    { ...req.body };

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(()=> res.status(200).json({message: 'sauce modifiée'}))
        .catch(error => res.status(400).json({ error }))
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/image/')[1];
        fs.unlink(`image/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce).console.log(sauce))
      .catch(error => res.status(404).json({ error }))
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};

exports.likeDislike = (req, res, next) => {
  let userId = req.body.userId;
  let likes = req.body.likes;
  let dislikes = req.body.dislikes;
  let like = req.body.like;
  usersLiked = req.body.usersLiked;
  usersDisliked = req.body.usersDisliked;

  // on va updater les informations relatives à la sauce. On aime ou on n'aime pas. 
  //updateOne prend plusieurs parametres.
  //param1 : elt de comparaison
  //param2 : les changts à implementer 

      // ON AIME LA SAUCE
      if (like === 1) {
        Sauce.updateOne({_id : req.params.id}, {
          $inc: {likes : 1},
          $push: {usersLiked: userId}
        })
        .then(()=> res.status(200).json({message: 'sauce likée'}))
        .catch(error => res.status(400). json({ error }))
      }

      //ON N'AIME PAS LA SAUCE 
      if (like === -1) {
        Sauce.updateOne({_id: req.params.id}, {
          $push: {usersDisliked: userId},
          $inc: {dislikes : 1}
        })
        .then(()=> res.status(200).json({message: 'sauce dislikée'}))
        .catch(error => res.status(400). json({ error }))
      }

      // ON ANNULE UN LIKE OU UN DISLIKE
      if (like === 0) { 
        // on identifie la sauce à modifier
        Sauce.findOne({_id: req.params.id})
          .then((sauce) => {
            // on verifie si l'utilisateur a liké la sauce
            if (sauce.usersLiked.includes(userId)) { 
              //on modifie annule son like
              Sauce.updateOne({_id: req.params.id}, {
                  $pull: {usersLiked: userId},
                  $inc: {likes: -1}
                })
                .then(() => res.status(200).json({message: 'like annulé !'}))
                .catch((error) => res.status(400).json({error}))
            }
            // on vérifie si l'utilisateur a disliké la sauce
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({_id: req.params.id}, {
                  $pull: {usersDisliked: userId},
                  $inc: {dislikes: -1}
                })
                .then(() => res.status(200).json({message: 'dislike annulé !'}))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error}))
      }
    }
      