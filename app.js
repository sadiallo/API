//dans la ligne 3 on recupere le paquet express dans notre code
//pour recuperer le paquet on utilise le mot cle require qui indique a node js d'aller chercher la dependance express dans le dossier node module
const express = require('express')
const db = require("./db.js")

//on creee un instance d'une application express
const app = express() 
//middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// on creer une constante nommé port, sur lequel on va demarer notre API rest
const port = 3000


// c'est notre premier point de terminaison
app.get('/', (req, res) => {
    res.json({ message: "l'API marche bien" })
}) 

//Affichez la liste des articles
app.get("/api/articles", (req, res) => {
    const sql = "SELECT * FROM article" 
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({ message: "Affichez la liste des articles", data: rows})
    })
})

//affichez un article avec son ID
app.get("/api/articles/:id", (req, res) => {
    const {id: articleID} = req.params
    const sql = "SELECT * FROM article WHERE id = ?" 
    const params = [articleID]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({ message: `Affichez l'article ${articleID}`, data: row})
    })
})

//creer un nouveau article
app.post("/api/articles", (req, res) => {
   const { titre, resume, contenu, auteur, datecreation, updatedate } = req.body

   if (!titre || !resume || !contenu || !auteur || !datecreation || !updatedate) {
     res.status(400).json({ message: "Merci de remplir tous les champs" })
     return
    }
    const article = { titre, resume, contenu, auteur, datecreation, updatedate}
    const sql =  "INSERT into article (titre, resume, contenu, auteur, datecreation, updatedate) VALUES (?,?,?,?,?,?)"
    const params = [article.titre, article.resume, article.contenu, article.auteur, article.datecreation, article.updatedate]
    db.run(sql, params, function (err, reslut) {
            if (err) {
                res.status(400).json({ error: err.message })
                return
            }
            res.status(201).json({ message: "Article crée avec succés", data: article })
        })    
}) 
 
//Modifiez un article
app.put("/api/articles/:id", (req, res) => {
    const { id: articleID } = req.params
    const { titre, resume, contenu, auteur, datecreation, updatedate } = req.body
 
    if (!titre || !resume || !contenu || !auteur || !datecreation || !updatedate) {
      res.status(400).json({ message: "Merci de remplir tous les champs" })
      return
     }
     const article = { titre, resume, contenu, auteur, datecreation, updatedate}
     const sql = "UPDATE article SET titre = ?, resume = ?, contenu = ?, auteur = ?, datecreation = ?, updatedate = ? WHERE id = ?"
     const params = [article.titre, article.resume, article.contenu, article.auteur, article.datecreation, article.updatedate, articleID]
     db.run(sql, params, function (err, reslut) {
             if (err) {
                 res.status(400).json({ error: err.message })
                 return
             }
             res.status(201).json({ message: `Article  ${articleID} modifié avec succés`, data: article })
         })    
 }) 
 
 //Supprimez un article
 app.delete("/api/articles/:id", (req, res) => {
    const { id: articleID } = req.params
    const sql = "DELETE FROM article WHERE id = ?"
    db.run(sql, articleID, function (err, reslut){
        if (err){
            res.status(400).json({ error: err.message})
            return
        }
        res.json({message: `Article ${articleID} supprimé`, data: this.changes})
    })
 })

//demarrer le serveur
app.listen(port, () => { 
    console.log(`Notre application Node est demarée sur: ${port}`)
})