angular.module('yourcall:app').controller('ReportedCtrl', function ($scope, questionService) {
    questionService.getReportedQuestions().success(function (questions) {
        $scope.questions = questions;
    });
});