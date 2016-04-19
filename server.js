var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var io = require('socket.io')(httpServer);

var Firebase = require('firebase');
var rootRef = new Firebase('https://insy-2016-web.firebaseio.com/');

var PORT = 3000;

var pins = process.argv;

httpServer.listen(PORT);  
console.log('Server available at http://localhost:' + PORT);  
var relay;

//Arduino board connection
var board = new five.Board();  
board.on("ready", function() {  
  console.log('Arduino connected');

  pins.forEach(function (element, index) {
    pins[index] = {
      pin: element,
      relay: new five.Relay(pin)
    }
  });
});

// TODO: communicate with firebase?
//Socket connection handler
io.on('connection', function (socket) {  
  console.log("socket id: " + socket.id)        

  socket.on('door:open', function (data) {    
    pins[data.pin].relay.open()
    console.log("Door on pin " + data.pin + " opened");
  });
  socket.on('door:close', function (data) {
    pins[data.pin].relay.close()
    console.log("Door on pin " + data.pin + " closed");
  });
});

console.log('Waiting for connection'); 