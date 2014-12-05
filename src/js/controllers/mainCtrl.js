angular.module('yourcall:app').controller('MainCtrl', function ($scope, $http, $location, pageService, questionService, utilityService) {

    $scope.title = pageService.getTitle;

    utilityService.readCookie('votes');

    questionService.getRandomQuestion().then(function (response) {
        $scope.question = response.data[0];
        questionService.fetchedQuestions.push(response.data[0]);

        if ($location.path() === '/') {
            $location.path('/' + $scope.question.url);
        }
    });

});