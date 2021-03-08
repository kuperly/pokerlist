var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var http = require('http');
var https = require('https');

var cities = require('cities');


MongoClient = require('mongodb').MongoClient
mongoose.Promise = require('bluebird');
// var uri = 'mongodb://kuperly:kuperly@ds113958.mlab.com:13958/pokerprod';
var uri = 'mongodb+srv://kuperly:kuperly@pokerprod.p7xwr.mongodb.net/pokerprod?retryWrites=true&w=majority';
var key ="80P3JjRAa2EAWYX7Zx9-QlMuOjf2ZLNW";

mongoose.connect(uri);
var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error'));
db.once('open', function(){
    console.log('mongo is on');
})

 


var app = express();
var Schema = mongoose.Schema;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// serve angular front end files from root path
app.use('/', express.static('app', { redirect: false }));
 


// groups
var groupsDataScheme = new Schema({
    groupName: String,
    country: String,
    city: String,
    adminName: String,
    adminId: String,
    days:[]
},{collection: 'groups'});

// users
var usersDataScheme = new Schema({
    Fname: String,
    Lname: String,
    email: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    role: {type:String, require:true},
    status: String
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


var groupData = mongoose.model('groupData', groupsDataScheme);
var userData = mongoose.model('userData', usersDataScheme);
var gameData = mongoose.model('gameData', gameDataScheme);
var cashInData = mongoose.model('cashInData', cashInDataScheme);
var cashOutData = mongoose.model('cashOutData', cashOutDataScheme);

// get all groups
app.get('/api/getAllGroups',function(req,res){
    groupData.find()
        .then(function(doc){
            res.send(doc);
            console.log(doc);
        },function(err){
            res.send(err);
        });
    
});

// set new group
app.post('/api/setNewGroup',function(req,res){ 

    var group = new groupData({
        groupName: req.body.groupName,
        country : req.body.country,
        city : req.body.city,
        adminName: req.body.adminName,
        adminId: req.body.adminId,
        days: req.body.days
    });
    
    group.save(function(err,group_id){
        res.status(200).json(group_id);
    })
});

// get all users
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
        role: 0,
        status: 'new'
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
app.post('/api/username',function(req,res) {
    
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
    
    if(!req.body.status){
        req.body.status = 'new';
    }
    
    var update = {$set:{
        "username": req.body.username,
        "password" : req.body.password,
        "phone" : req.body.phone,
        "email" : req.body.email,
        "Lname" : req.body.Lname,
        "Fname" : req.body.Fname,
        "role" : req.body.role,
        "status": req.body.status
    }};
    
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

// delete user
app.post('/api/deleteUser',function(req,res) { // OK
    
    var query = req.body.id;
    
    userData.findByIdAndRemove(query,
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
    
});


// OK - by gameId
app.get('/api/getAllCashIn/:id',function(req,res){
    
});

// OK - by gameId
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

app.post('/api/deleteGame',function(req,res) { // OK
    
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

app.get('/api/getCashInAndOutByGameIdAndUID',function(req,res) { // OK
    
        var gameID = req.query.id;
        var userID = req.query.uid;
        var data = {};
        cashInData.find({game_id:gameID, user_id:userID})
            .then(function(_cachIn) {
                data.cachIn = _cachIn;

                //cach out
                cashOutData.find({game_id:gameID, user_id:userID})
                .then(function(_cachOut) {

                    data.cachOut = _cachOut;
                    
                    res.send(data);
                },function(err){
                    res.send(err);
                });
            },function(err){
                res.send(err);
            });
        
    });

app.post('/api/deleteUserCashIn',function(req,res) { // OK
    
    var query = req.body['id'];
    
    cashInData.findByIdAndRemove(query,
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
    
});

// Delete cashout
app.post('/api/deleteUserCashOut',function(req,res) { 
    
    var query = req.body['id'];
    
    cashOutData.findByIdAndRemove(query,
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
    
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

app.get('/api/getUserCashIn',function(req,res){

    var id = req.query.id;
    cashInData.find({user_id:id})
        .then(function(doc){
            res.send(doc);
        },function(err){
            res.send(err);
        });
    
});

app.get('/api/getUserCashOut',function(req,res){

    var id = req.query.id;
    cashOutData.find({user_id:id})
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

app.post('/api/getByCitysAndState',function(req,res) { // not used! 

     var city = req.body.city;
     var state = req.body.countryid;
     var API_KEY = req.body.API_KEY;

    var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+city+'&types=(cities)&components=country:'+state+'&key='+API_KEY;

    console.log('google');

    https.get(url,function(response) {
        console.log(response);
        // res.send(response);
        
    })
});  


// TODO - get user by group id

app.post('/api/getUsersByGroupId',function(req,res) {
    
    var groupId = req.body.groupID;
    
    userData.find({groupId},
        function (err, doc) { // callback
            if (err) {
                res.json(err);
            } 
            res.json(doc);
        }
    );
});



app.get('*', function(req,res){
    res.sendfile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 3000);

console.log("Server running from port 3000");