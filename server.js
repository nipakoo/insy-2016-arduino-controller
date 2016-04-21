var five = require("johnny-five");

var Firebase = require('firebase');
var rootRef = new Firebase('https://insy-2016-web.firebaseio.com/');

rootRef.authWithPassword({
  email: 'locker_system@example.com',
  password: 'insy2016'
});

var button_pin = process.argv[2];
var servo_pin = process.argv[3];

var button;
var servo;

var changed_package;

var board = new five.Board();  
board.on("ready", function() {  
  console.log('Arduino connected');

  button = new Button(button_pin)
  servo = new Servo(servo_pin);

  button.on('hold', function (data) {
    console.log("Door closed");

    servo.min();
    if (changed_package.is_sending) {
      changed_package.update({
        is_sending: false
      });
    } else if (changed_package.is_receiving) {
      changed_package.update({
        is_receiving: false
      });
    }

  });
});

rootRef.child("packages").on("child_changed", function (snapshot) {
  console.log("received");
  changed_package = snapshot.val();

  if (changed_package.is_sending) {
    servo.max();
  } if (changed_package.is_receiving) {
    servo.max();
  }

});

console.log('Waiting for connection'); 