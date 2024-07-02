const express= require('express');// : Importation des modules nécessaires pour l'application express ,body parser,cors,mysql
const bodyparser =  require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
// Création d'une instance d'Express pour la gestion des routes et des requêtes HTTP
const app = express();
// Utilisation de CORS pour permettre les requêtes cross-origin
app.use(cors());
app.use(bodyparser.json());//Utilisation de body-parser pour analyser le corps des requêtes HTTP

// Connect to data Base 
const db = mysql.createConnection({// pour établir une connexion à la base de données MySQL
    host: "localhost",
    user : "root",
    password : "",
    database : "cars",
    port:3306
})
//check data base conection 

db.connect(err=>{
    if(err){
        console.log(err,'failed to connect :((');
    }
    else{console.log("data base connected yeeeeeeeey!!!");}
    
})
//utiliser opérations CRUD (GET, POST) pour gere les donner pour deposer data dans server ou get donner sans parametre

// api GET LES DONNER DE CAR
app.get('/user',(req,res)=>{
    let qr = 'select * from car_info';
    db.query(qr,(err,result)=>{//query biblioteque sql pour executer qr
        if(err){
            console.log(err,"error");
        }
        else{
            res.send({
                message :"all ens data",
                data : result,
            })
        }
    })

})
//api POUR LOGIN


    
app.post('/user2',(req,res)=>{
    console.log("here u are ",req.body.password) ;
    let qr = `select * from admin where id = '${req.body.password}'`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err,"error");
        }
        else{
            res.send({
                message :"nothing to worry about :|",
                data : result,
            })
        }
    })


})
//gerer les model pour recherche
app.get('/modelcar',(req,res)=>{
    
    console.log("here u are modellll ",req.body.model) ;
    let qr = `select DISTINCT  model  from car_info`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err,"error");
        }
        else{
            res.send({
                message :"modellllllllllllllllllllllllllllllllllllllllllllllllllllll",
                data : result,
            })
        }
    })


})
//POST LE VOITURE DE MODEL SPECIFIER
app.post('/modelcarfilter', (req, res) => {
    const requestedModel = req.body.value;
    console.log("Here you are specific: ", requestedModel);
    const qr = `SELECT * FROM car_info WHERE model = ?`;

    db.query(qr, [requestedModel], (err, result) => {
        if (err) {
            console.log(err, "Error");
        } else {
            res.send({
                message: "Filtered data",
                data: result,
            });
        }
    });
});

//faire ajout dans base de donnee

app.post('/ajouter',(req,res)=>{
    console.log("here u are ",req.body.model) ;
    const id = req.body.id;
    const brand = req.body.brand;
    const model=req.body.model;
    const year=req.body.year;
    const color=req.body.color;
    const image=req.body.image;
    const prix=req.body.prix;
    const values  = [id,brand,model,year,color,image,prix];
    
    let qr = `INSERT INTO car_info (id, brand, model, year, color, image, prix) VALUES(? , ? , ? , ? ,? ,?,?)`;
    db.query(qr,values,(err,result)=>{
        if(err){
            console.log(err,"error");
        }
        else{
            res.send({
                message :"connected from api ajouter ",
                data : result,
            })
        }
    })


})
//ajouter location
app.post('/ajouterlocation', (req, res) => {
     
    console.log("Received location data: ");

  
    const { first_name, numero, date_debut, date_fin } = req.body;
  
    const values = [first_name, numero, date_debut, date_fin];
    console.log(values);
  
    let qr = `INSERT INTO locations (first_name, numero, date_debut, date_fin) VALUES (?, ?, ?, ?)`;
    db.query(qr, values, (err, result) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({
          message: "Error adding location data",
          error: err
        });
      } else {
        res.status(200).json({
          message: "Location data added successfully",
          data: result
        });
      }
    });
  });



//FAIRE MODEFICATION
app.post('/modifier', (req, res) => {
    console.log("modddddddddddifiiiiiiiiii",req.body.prix)
    const id = req.body.id;
    const brand = req.body.brand;
    const model=req.body.model;
    const year=req.body.year;
    const color=req.body.color;
    const image=req.body.image;
    const prix=req.body.prix;
    const query = `UPDATE car_info SET 
    id='${id}',
    brand='${brand}',
    model='${model}',
    year='${year}',
    color='${color}',
    image='${image}',
    prix='${prix}' 
    WHERE id='${id}'`;

       
       


    const values = [id, brand, model, year, color, image, prix];

    db.query(query, values, (err, result) => {
        if (err) {
            console.log(err, "Error updating car details");
            res.status(500).send({
                message: "Error updating car details",
                error: err
            });
        } else {
            if (result.affectedRows > 0) {
                res.status(200).send({
                    message: "Car details updated successfully",
                    data: result
                });
            } else {
                res.status(404).send({
                    message: "Car not found"
                });
            }
        }
    });
});

//faire supprimer
app.post('/supprimer',(req,res)=>{
    
    console.log("iddddddddddddddddddddddddddddddddddd",req.body.id);
    let qr = `DELETE FROM car_info WHERE id = ${req.body.id}`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err,"error");
        }
        else{
            res.send({// C'est une méthode Express utilisée pour envoyer une réponse HTTP au client
                message :"connected from api suprimer ",
                data : result,
            })
        }
    })


})

    
  

//ecoute serveur 
//Démarrage du serveur Express sur le port 4000
app.listen(4000,()=>{
    console.log("serer is runnoing");
})
