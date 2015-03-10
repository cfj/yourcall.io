angular.module('yourcall:app').controller('MainCtrl', function ($scope, $http, $location, pageService, questionService, utilityService) {

    $scope.title = pageService.getTitle;

    if ($location.path() === '/') {
        questionService.getRandomQuestion()
        .success(function (response) {
            console.log(response);
            $location.path('/q/' + response);
        })
        .error(function (response) {
            $location.path('/ask');
        });
    }

});