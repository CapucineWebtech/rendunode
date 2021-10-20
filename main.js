const port = 3000
const express = require( 'express' )
const bodyParser = require('body-parser')
const app = express()
const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set( 'views', __dirname + '/views' )
app.use('/', express.static('public'))

const {createConnection, Connection, getConnection}  =  require("typeorm")

const fileUpload = require('express-fileupload')
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : '/tmp/'
}))
app.use(bodyParser.json())
app.use( bodyParser.urlencoded( { extended: true } ) )


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
  })
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
    return res.render('formulaire', { lespostes: results })
  })
})

app.post('/formulaire', (req, res, next) => {
  let connection = getConnection()
  connection.query('SELECT MAX(id) as mID FROM post', function (error, results, fields) {
    let photoID = results[0].mID + 1
    req.files.photo.mv( `./public/photos/photo${photoID}.jpg`, ( err ) => // Je renomme les photos pour éviter de les écraser si elles ont le même nom. J'ai rajouter le .jpg pour la visualisation mais en vrai sans ça fonctionne aussi et ça accepte les autres formats
    {
      if (err)
        return res.status(500).send(err)
    })
    const titre = req.body.titre
    const description = req.body.description
    const laphoto = "photo"+ photoID +".jpg"

    connection.query(`INSERT INTO post (titre, description, photo) VALUES ("${titre}", "${description}", "${laphoto}") `, function (error, resultsPost, fields) {
      connection.query('SELECT titre, description, photo FROM post', function (error, results, fields) {
        return res.render('formulaire', { lespostes: results })
      })
    })
  })
})

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`)
})