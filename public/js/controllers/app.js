app.controller('MainCtrl', ['$scope', '$http', '$location', 'Page', function ($scope, $http, $location, Page) {


    $scope.Page = Page;


    $scope.questions = [];

    $http.get('/api/random')
        .success(function (data) {
            $scope.questions = [];
            $scope.questions.push(data[0]);
            $scope.question = $scope.questions[0];
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });



}]);