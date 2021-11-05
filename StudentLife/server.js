const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/SLdb";
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
    
});


let messages = [];

io.on('connection', socket => {
    console.log(`Socket connected: ${socket.id}`);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("chats");
        dbo.collection("Læringsteknologi").find({}, {
            projection: {
                _id: 0,
                user: 1,
                message: 1
            }
        }).toArray(function (err, messages) {
            if (err) throw err;
            console.log(messages);
            console.log(`Displayed past messages for: ${socket.id}\n`);
            console.log("=========================================================\n");
            socket.emit('previousMessages', messages);
            db.close();
        });
    });

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("chats");
            dbo.collection("Læringsteknologi").insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    });
});

server.listen(3000);