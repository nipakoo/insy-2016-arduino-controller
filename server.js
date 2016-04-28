var five = require("johnny-five");

var Firebase = require('firebase');
var rootRef = new Firebase('https://insy-2016-web.firebaseio.com/');

rootRef.authWithPassword({
  email: 'locker_system@example.com',
  password: 'insy2016'
}, function (error, authData) {
  if (error) {
    console.log('Login Failed!', error);
  } else {
    console.log('Authenticated successfully!');
    setupFirebaseListeners();
  }
});

var setupFirebaseListeners = function () {
  this.updatePackage = function (snapshot) {
    var ref = snapshot.ref();
    var data = snapshot.val();

    package.updateStatus(ref, data);
  };

  rootRef.child('packages').on('child_added', this.updatePackage);
  rootRef.child('packages').on('child_changed', this.updatePackage);
};

var package = (function () {
  this.updateStatus = function (ref, data) {
    if (data.is_sending) {
      this.setReadyForPickup(ref);
    }

    if (data.is_receiving) {
      this.setPackageAsDelivered(ref);
    }
  }.bind(this);

  this.setReadyForPickup = function (ref) {
    console.log('Marking package ready for pickup');
    ref.update({
      is_delivered: false,
      is_sending: false,
      updated_at: Firebase.ServerValue.TIMESTAMP
    });
  };

  this.setPackageAsDelivered = function (ref) {
    console.log('Marking package as delivered');
    ref.update({
      is_delivered: true,
      is_receiving: false,
      updated_at: Firebase.ServerValue.TIMESTAMP
    });
  };

  return {
    updateStatus: this.updateStatus
  };
})();

//var button_pin = process.argv[2];
//var servo_pin = process.argv[3];

var button;
var servo;
var led;

var led_pin = 13;
var button_pin = 2;
var servo_pin = 9;

var board = new five.Board();

board.on('ready', function() {
  console.log('Arduino connected');

  button = new five.Button(button_pin);
  led = new five.Led(led_pin);
  servo = new five.Servo({
      pin: servo_pin,
      center: true});

  button.on('down', function (data) {
    console.log('Door closed');

        //for testing purposes
        led.stop().off();
        servo.to(90);
       
//      if (changed_package.is_sending) {
//      changed_package.update({
//        is_sending: false
//      });
//    } else if (changed_package.is_receiving) {
//      changed_package.update({
//        is_receiving: false
//      });
//    }
  });
    
    button.on('up', function (data) {
        console.log('Door opened');
          
        //for testing purposes
        led.blink();
        servo.to(0);
  });
});

console.log('Waiting for connection');
