const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/CSdb";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");

    var accounts = db.db("accounts");
    accounts.createCollection("users", function (err, res) {
        if (err) throw err;
        console.log("Collection users created!");
        db.close();
    });

    var chats = db.db("chats");
    chats.createCollection("læringsteknologi", function (err, res) {
        if (err) throw err;
        console.log("Collection læringsteknologi created!");
        db.close();
    });

    chats.createCollection("hw-&-robotteknologi", function (err, res) {
        if (err) throw err;
        console.log("Collection hw-&-robotteknologi created!");
        db.close();
    });

    chats.createCollection("web-programmering", function (err, res) {
        if (err) throw err;
        console.log("Collection web-programmering created!");
        db.close();
    });

    chats.createCollection("3d-programmering", function (err, res) {
        if (err) throw err;
        console.log("Collection 3d-programmering created!");
        db.close();
    });
});