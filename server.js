var http = require('http');
var path = require('path');
var express = require('express');
var router = express();
var server = http.createServer(router);


var bodyParser = require('body-parser')
//Insecure by the way
router.use( express.bodyParser() );

router.use(express.static(path.resolve(__dirname, 'client')));

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});
