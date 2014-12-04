app.controller('AllCtrl', function ($scope, $http) {
    
    $http.get('/api/questions')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    
}]);