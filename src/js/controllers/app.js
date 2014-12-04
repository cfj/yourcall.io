app.controller('MainCtrl', function ($scope, $http, $location, pageFactory) {

    $scope.page = pageFactory;

    $scope.questions = [];

    $http.get('/api/random')
        .success(function (data) {
            //$scope.questions = [];
            $scope.questions.push(data[0]);
            $scope.question = $scope.questions[0];
            
            if ($location.path() === '/') {
                $location.path('/' + $scope.question.url);
            }

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

});