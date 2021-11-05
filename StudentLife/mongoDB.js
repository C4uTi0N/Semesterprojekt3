const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/sldb";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");

    var dbo = db.db("chats");
    dbo.createCollection("Læringsteknologi", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
    var sampleMsg = {
        user: "User Name",
        message: "Message text"
    };
    dbo.collection("Læringsteknologi").insertOne(sampleMsg, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});