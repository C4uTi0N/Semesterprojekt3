const express = require('express');
const app = express();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/CSdb";

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    name => users.find(user => user.name == name),
    id => users.find(user => user.id == id)
)

let users = []
let userNames = []

app.set('view-engine', 'ejs')
app.use(express.static("views"))
app.use(express.urlencoded({
    extended: false
}))
app.use(flash())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {
        name: req.user.name
    })
})

app.get('/login', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var accounts = db.db("accounts");
        accounts.collection("users").find({}, {
            projection: {
                _id: 0,
                id: 1,
                name: 1,
                password: 1
            }
        }).toArray(function (err, usersDB) {
            if (err) throw err;
            users = usersDB;
            console.log(users)
            db.close();
        });
    });
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/home', checkAuthenticated, (req, res) => {
    res.render('home.ejs', {name: req.user.name});

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var accounts = db.db("accounts");
        accounts.collection("users").find({}, {
            projection: {
                _id: 0,
                id: 0,
                password: 0
            }
        }).toArray(function (err, userNamesDB) {
            if (err) throw err;
            userNames = userNamesDB;
            console.log(userNames)
            db.close();
        });
    });
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        var user = {
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPassword
        }

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var accounts = db.db("accounts");
            accounts.collection("users").insertOne(user, function (err, res) {
                if (err) throw err;
                console.log(`1 document inserted:\n ID: "${user.id}"\n Username: "${user.name}"\n Password: ${user.password}\n`);
                db.close();
            });
        });
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

let messages = [];

io.on('connection', socket => {
    socket.emit(`loadUsers`, userNames);
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