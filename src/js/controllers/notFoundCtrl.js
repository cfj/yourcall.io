angular.module('yourcall:app').controller('NotFoundCtrl', function ($scope, questionService) {
    
    questionService.getRandomQuestion().then(function (response) {
        $scope.question = response.data[0];
    });

});