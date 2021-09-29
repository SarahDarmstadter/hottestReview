const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const SaucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');

//Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const path = require('path');

//pluggin de sécurité contre les attaques cross_site, clickjacking, XSS
const helmet = require('helmet');

const session = require('express-session');
const expiryDate = new Date( Date.now() + 60 * 60 * 18000 ); // 18 hours

//Connexion de la BDD
mongoose.connect('mongodb+srv://caputDraconis:caputDraconis@cluster0.prp1w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
  useCreateIndex: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

  
/*Helmet n’est actuellement qu’une collection de neuf fonctions middleware plus petites qui définissent des en-têtes HTTP liés à la sécurité :

csp définit l’en-tête Content-Security-Policy pour la protection contre les attaques de type cross-site scripting et autres injections intersites.
hidePoweredBy supprime l’en-tête X-Powered-By.
hsts définit l’en-tête Strict-Transport-Security qui impose des connexions (HTTP sur SSL/TLS) sécurisées au serveur.
ieNoOpen définit X-Download-Options pour IE8+.
noCache définit des en-têtes Cache-Control et Pragma pour désactiver la mise en cache côté client.
noSniff définit X-Content-Type-Options pour protéger les navigateurs du reniflage du code MIME d’une réponse à partir du type de contenu déclaré.
frameguard définit l’en-tête X-Frame-Options pour fournir une protection clickjacking.
xssFilter définit X-XSS-Protection afin d’activer le filtre de script intersites (XSS) dans les navigateurs Web les plus récents.
source : https://expressjs.com/fr/advanced/best-practice-security.html */
app.use(helmet());


//ajout d'un middleware pour eviter les erreurs de CORS. 
//Ce M. s'appliquera à toutes les routes. 
app.use((req, res, next) => {
//On indique que les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');

//On indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

//On indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

 // trust first proxy (parce que si on met secured : true, mais qu'on est pas sur httpS, cela ne marchera)
app.set('trust proxy', 1);

//Options pour sécuriser les cookies
app.use(session({
    secret: 'userId', 
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: true,
      httpOnly: true,
      expires: expiryDate
     }
  }));
  
//Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande
app.use(bodyParser.json());

app.use('/image', express.static(path.join(__dirname, 'image')));
  
app.use('/api/sauces', SaucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;







