angular.module('yourcall:app').controller('SingleQuestionCtrl', function ($scope, $routeParams, $location, questionService, UITextService) {

    var vm = this;

    vm.showResult = false;

    if($location.$$path.indexOf('result') > -1) {
        vm.showResult = true;
    }

    vm.reportMessage = UITextService.REPORT;
    vm.deleteMessage = UITextService.DELETE;

    if($routeParams.question_url) {
        questionService.getQuestion($routeParams.question_url).success(function (question) {
            vm.question = question;
            vm.isOwnedQuestion = question.owned;
            vm.totalVotes = question.totalVotes;
        });
    }

    questionService.getRandomQuestion().success(function (url) {
        vm.nextQuestion = url;
    });

    vm.deleteQuestion = function (questionId) {
        vm.deleteMessage = UITextService.PENDING_DELETE;

        questionService.deleteQuestion(questionId).success(function (question) {
            $location.path('/q/' + vm.nextQuestion);
        });
    };

    vm.vote = function (question, vote) {
        if(!question.hasVoted) {
            questionService.voteOnQuestion(question, vote).success(function (response) {
                vm.totalVotes = question.option_1_votes + question.option_2_votes;
            });
        }
    };

    vm.reportQuestion = function (id) {
        vm.reportMessage = UITextService.REPORTED;
        questionService.reportQuestion(id);
    };
});