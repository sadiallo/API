const sqlite3 = require("sqlite3").verbose()

const dbFile = "db.sqlite"

//se connecter à la base de données
let db = new sqlite3.Database(dbFile, (err) => {
    if(err){
        console.error(err.message)
        throw err
    }else{
        console.log("Connexion à la base sqlite3 ...")
        const sql = `CREATE TABLE article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre text,
            resume text,
            contenu text,
            auteur text,
            datecreation date,
            updatedate date
        )`
        db.run(sql, (err) => {
            if(err){
                console.log("Table deja creee")
            }
        })
    }
})

module.exports = db