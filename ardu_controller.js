App.controller('ArduController', function ($scope,mySocket) {
                 
    $scope.openDoor = function () {
        mySocket.emit('door:open');
        console.log('DOOR OPEN');
    };
    
    $scope.closeDoor = function () {      
        mySocket.emit('door:close');
        console.log('DOOR CLOSED');
    };
});


