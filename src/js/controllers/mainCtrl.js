angular.module('yourcall:app').controller('MainCtrl', function ($scope, $http, $location, pageService, questionService, utilityService) {

    $scope.title = pageService.getTitle;

    if ($location.path() === '/') {
        questionService.getRandomQuestion()
        .success(function (response) {
            $location.path('/q/' + response.data);
        })
        .error(function (response) {
            $location.path('/ask');  
        });
    }

});