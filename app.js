var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
const socketServices =require("./services/socket/ts.js");
//var async = require('async');
var scokets = [];
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/v1/arrowconnect', require('./router'));
app.use(express.static(__dirname + '/build/'));
io.on("connection",function(socket){

  socketServices.createStream(socket);
  console.log('socket connection made from server');

});

exports = module.exports = http;
