angular.module('yourcall:app').controller('ReportedCtrl', function ($scope, $http) {
    $http.get('/api/reported')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });    
});