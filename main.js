//package name rendunode

//Créer un formulaire de photos souvenirs ou l’utilisateur upload une photo de ses vacances il mettre un titre et sa description..

//On affichera en dessous la liste des photos souvenirs avec chaque site et chaque description.

//Pour réaliser le projet avec NodeJS en enregistrant en base de données mysql  chaque souvenir et en utilisant le moteur de template moustache.

//Utiliser Git et Github pour pusher dans un repository.

const port = 3000
const express = require( 'express' )
const bodyParser = require('body-parser')
const app = express()
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set( 'views', __dirname + '/views' );

const fileUpload = require('express-fileupload')
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.use(bodyParser.json());
app.use( bodyParser.urlencoded( { extended: true } ) );


const connect = async () =>
{
   try
  {
  const connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "basedevoirnod"
  } );

  } catch ( e )
  {
    console.log(e)
  }
}
//connect()

app.get( '/formulaire', ( req, res ) =>
{
  return res.render('formulaire')
})

app.post('/formulaire', (req, res, next) => {
  console.log( "hey : ", req.files.photo );
  req.files.photo.mv( `./photos/${req.files.photo.name}`, ( err ) =>
  {
      if (err)
          return res.status(500).send(err);

      console.log('File uploaded!');
  })

    const titre = req.body.titre
    const description = req.body.description

    return res.render('formulaire',
        {"titre" : titre, "description" : description})
})

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});