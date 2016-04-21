var five = require("johnny-five");

var Firebase = require('firebase');
var rootRef = new Firebase('https://insy-2016-web.firebaseio.com/');

rootRef.authWithPassword({
  email: 'locker_system@example.com',
  password: 'insy2016'
}, function() {
  console.log("auth");
});

var button_pin = process.argv[2];
var servo_pin = process.argv[3];

var button;
var servo;

var changed_package;

//Arduino board connection
var board = new five.Board();  
board.on("ready", function() {  
  console.log('Arduino connected');

  button = new Button(button_pin)
  servo = new Servo(servo_pin);

  button.on('hold', function (data) {
    console.log("Door closed");

    if (changed_package.is_sending) {
      changed_package.update({
        is_sending: false
      });
    }
  });
});

rootRef.child("packages").on("child_changed", function (snapshot) {
  console.log("received");
  changed_package = snapshot.val();

  if (changed_package.is_sending) {
    //servo.max();
    testing();
  }
});

function testing() {
  if (changed_package.is_sending) {
    changed_package.update({
      is_sending: false
    });
  }
  console.log("Door closed");
}

console.log('Waiting for connection'); 