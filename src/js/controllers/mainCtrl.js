angular.module('yourcall:app').controller('MainCtrl', function ($scope, $http, $location, pageService, questionService, utilityService) {

    $scope.title = pageService.getTitle;

    questionService.getRandomQuestion().then(function (response) {
        if ($location.path() === '/') {
            $location.path('/' + response.data[0].url);
        }
    });

});