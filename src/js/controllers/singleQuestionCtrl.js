angular.module('yourcall:app').controller('SingleQuestionCtrl', function ($scope, $routeParams, $location, questionService, UITextService) {

    $scope.reportMessage = UITextService.REPORT;
    $scope.deleteMessage = UITextService.DELETE;

    if($routeParams.question_url) {
        questionService.getQuestion($routeParams.question_url).success(function (question) {
            $scope.question = question;
            $scope.isOwnedQuestion = question.owned;
            $scope.totalVotes = question.totalVotes;
        });
    }

    questionService.getRandomQuestion().success(function (data) {
        $scope.nextQuestion = data[0];
    });

    $scope.deleteQuestion = function (questionId) {
        $scope.deleteMessage = UITextService.PENDING_DELETE;

        questionService.deleteQuestion(questionId).success(function (question) {
            $location.path('/' + $scope.nextQuestion.url);
        });
    };

    $scope.vote = function (question, vote) {
        questionService.voteOnQuestion(question, vote).success(function (response) {
            $scope.totalVotes = question.option_1_votes + question.option_2_votes;
        });
    };

    $scope.reportQuestion = function (id) {
        $scope.reportMessage = UITextService.REPORTED;
        questionService.reportQuestion(id);
    };
});