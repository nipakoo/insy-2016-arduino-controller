var App = angular.module('App', ['btford.socket-io']);

App.factory('mySocket', function (socketFactory) {
    return socketFactory();
});




