angular.module('yourcall:app').controller('AllCtrl', function ($scope, questionService) {
    questionService.getAllQuestions().success(function (questions) {
        $scope.questions = questions;
    });
});