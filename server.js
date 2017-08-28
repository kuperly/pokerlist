var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//test
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
//

MongoClient = require('mongodb').MongoClient
mongoose.Promise = require('bluebird');
var uri = 'mongodb://kuperly:kuperly@ds113958.mlab.com:13958/pokerprod';
var key ="80P3JjRAa2EAWYX7Zx9-QlMuOjf2ZLNW";

mongoose.connect(uri);
var db = mongoose.connection;

db.on('erroe', console.error.bind(console,'connection error'));
db.once('open', function(){
    console.log('mongo is on');
})

var app = express();
var Schema = mongoose.Schema;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// users
var usersDataScheme = new Schema({
    Fname: String,
    Lname: String,
    email: String,
    username: String,
    password: String,
    phone: String,
    role: {type:String, require:true}
},{collection: 'users'});

// new game
var gameDataScheme = new Schema({
    game_date: Date,
    game_status: String,
    game_location: String
},{collection: 'games'});

// cashIn
var cashInDataScheme = new Schema({
    user_id: String,
    user_name: String,
    game_id: String,
    cash_in: Number
},{collection: 'cashIn'});

// cashOut
var cashOutDataScheme = new Schema({
    user_id: String,
    user_name: String,
    game_id: String,
    cash_out: Number
},{collection: 'cashOut'});

var userData = mongoose.model('userData', usersDataScheme);
var gameData = mongoose.model('gameData', gameDataScheme);
var cashInData = mongoose.model('cashInData', cashInDataScheme);
var cashOutData = mongoose.model('cashOutData', cashOutDataScheme);


app.get('/api/getAllUsers',function(req,res){
    userData.find()
        .then(function(doc){
            res.send(doc);
            console.log(doc);
        },function(err){
            res.send(err);
        });
    
});

//register
app.post('/api/users',function(req,res){
    console.log(req.body);
    var user = new userData({
        Fname: req.body.firstName,
        Lname: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password,
        role: 0
    });
    
    user.save(function(err,user_id){
        res.status(200).json(user_id);
    })
});

// login
app.post('/api/authenticate',function(req,res){
    
    var username = req.body.username;
    var password = req.body.password;
    
    userData.find({username,password},
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
});

// get user by username
app.post('/api/username',function(req,res){
    console.log(req.body);
    
    var username = req.body.username;
    
    userData.find({username},
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
});

// update user
app.post('/api/updateuser',function(req,res){
    console.log(req.body);
    

    var query = req.body['_id'];
    
    
    var update = {$set:{
        "username": req.body.username,
        "password" : req.body.password,
        "phone" : req.body.phone,
        "email" : req.body.email,
        "Lname" : req.body.Lname,
        "Fname" : req.body.Fname
    }};
    
    // update['$set'].push("password" : req.body.password);
    var option = {new:true};

    userData.findByIdAndUpdate(query,update,option,
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );



});


// TODO - by gameId
app.get('/api/getAllCashIn/:id',function(req,res){
    
});

// TODO - by gameId
app.get('/api/getAllCashOut/:id',function(req,res){
    
});

app.post('/api/setCashIn',function(req,res){
    
    var cashIn = new cashInData({
        user_id : req.body.user_id,
        user_name: req.body.user_name,
        game_id : req.body.game_id,
        cash_in : req.body.cash_in
    });
    
    cashIn.save(function(err,cashIn_id){
        res.status(200).json(cashIn_id);
    })
});

app.post('/api/setCashOut',function(req,res){ 
    console.log(req.body);
    var cashOut = new cashOutData({
        user_id : req.body.user_id,
        user_name: req.body.user_name,
        game_id : req.body.game_id,
        cash_out : req.body.cash_out
    });
    
    cashOut.save(function(err,cashOut_id){
        res.status(200).json(cashOut_id);
    })
});

app.post('/api/setNewGame',function(req,res){ 

    var game = new gameData({
        game_date : req.body.game_date,
        game_status : req.body.game_status,
        game_location : req.body.game_location
    });
    
    game.save(function(err,game_id){
        res.status(200).json(game_id);
    })
});

app.post('/api/closeGame',function(req,res){ // ok
    
    var query = req.body.game_id;
    
    var update = {$set:{"game_status": 'Close'}};
    var option = {new:true};

    gameData.findByIdAndUpdate(query,update,option,
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
    
});

app.post('/api/deleteGame',function(req,res){ // OK
    
    var query = req.body.game_id;
    
    gameData.findByIdAndRemove(query,
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
    
});

app.get('/api/getAllGames',function(req,res){
    gameData.find()
        .then(function(doc){
            res.send(doc);
            console.log(doc);
        },function(err){
            res.send(err);
        });
    
});

app.get('/api/getGame',function(req,res){

    var id = req.query.id;
    console.log(id);
    gameData.find({_id: id})
        .then(function(doc){
            res.send(doc);
        },function(err){
            res.send(err);
        });
    
});

app.get('/api/getCashInByGameId',function(req,res){

    var id = req.query.id;
    cashInData.find({game_id:id})
        .then(function(doc){
            res.send(doc);
        },function(err){
            res.send(err);
        });
    
});

app.get('/api/getCashOutByGameId',function(req,res){

    var id = req.query.id;
    cashOutData.find({game_id:id})
        .then(function(doc){
            res.send(doc);
        },function(err){
            res.send(err);
        });
    
});

app.get('/api/getAllCashIn',function(req,res){
    cashInData.find()
        .then(function(doc){
            res.send(doc);
        },function(err){
            res.send(err);
        });
    
});

app.get('/api/getAllCashOut',function(req,res){
    cashOutData.find()
        .then(function(doc){
            res.send(doc);
            console.log(doc);
        },function(err){
            res.send(err);
        });
    
});


app.listen(3000);
console.log("Server running from port 3000");