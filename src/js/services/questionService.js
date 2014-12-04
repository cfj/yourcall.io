angular.module('yourCall').factory('questionService', ['$http', function ($http) {
    var questionService = {};

    questionService.getRandomQuestion = function () {
        return $http.get('/api/random');
    };

    questionService.getAllQuestions = function () {};
    questionService.getReportedQuestions = function () {};
    questionService.deleteQuestion = function (questionID) {};
    questionService.createQuestion = function (question) {};

    return questionService;
}]);