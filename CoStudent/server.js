const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/CSdb";


app.set('views', path.join(__dirname, 'public/Sites'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.redirect("/index")
})

app.get('/index', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/links', (req, res) => {
    res.render('links');
});

app.get('/homework', (req, res) => {
    res.render('homework');
});


let messages = [];

io.on('connection', socket => {
    Chat(socket, "læringsteknologi", '#chat1');
    Chat(socket, "hw-&-robotteknologi", '#chat2');
    Chat(socket, "web-programmering", '#chat3');
    Chat(socket, "3d-programmering", '#chat4');
});

function Chat(socket, channel, chatId) {
    console.log(`Socket connected: ${socket.id}`);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var chats = db.db("chats");
        chats.collection(channel).find({}, {
            projection: {
                _id: 0,
                user: 1,
                message: 1,
                time: 1
            }
        }).toArray(function (err, messages) {
            if (err) throw err;
            console.log(messages);
            console.log(`Displayed past messages for: ${socket.id}\n`);
            console.log("=========================================================\n");
            socket.emit(`previousMessages${chatId}`, messages);
            db.close();
        });
    });

    socket.emit(`receivedMessage${chatId}`, messages);

    socket.on(`sendMessage${chatId}`, data => {
        messages.push(data);
        socket.broadcast.emit(`previousMessages${chatId}`, data);

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var chats = db.db("chats");
            chats.collection(channel).insertOne(data, function (err, res) {
                if (err) throw err;
                console.log(`1 document inserted:\n user: "${data.user}"\n message: "${data.message}"\n time: ${data.time}\n`);
                db.close();
            });
        });
    });
}

server.listen(3000);