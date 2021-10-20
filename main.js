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
app.use('/', express.static('public'));

const path = require( 'path' )
const {createConnection, Connection, getConnection}  =  require("typeorm");

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
connect()

app.get( '/formulaire', ( req, res ) =>
{
  let connection = getConnection()
  connection.query('SELECT titre, description, photo FROM post', function (error, results, fields) {
    if (error) throw error;
      console.log('The solution is: ', results);

    return res.render('formulaire', { lespostes: results });
  })
})

app.post('/formulaire', (req, res, next) => {
  req.files.photo.mv( `./photos/${req.files.photo.name}`, ( err ) =>
  {
    if (err)
        return res.status(500).send(err);
  })

  const titre = req.body.titre
  const description = req.body.description
  const laphoto = req.files.photo.name

  let connection = getConnection()

  connection.query(`INSERT INTO post (titre, description, photo) VALUES ("${titre}", "${description}", "${laphoto}") `, function (error, resultsPost, fields) {
    if (error) throw error;
      console.log('The solution is: ', resultsPost);
  })

  connection.query('SELECT titre, description, photo FROM post', function (error, results, fields) {
    if (error) throw error;
      console.log('The solution is: ', results);

    return res.render('formulaire', { lespostes: results });
  })
})

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});