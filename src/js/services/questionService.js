angular.module('yourcall:services').factory('questionService',function ($http, UITextService, utilityService, appService) {
    var questionService = {};

    questionService.fetchedQuestions = [];

    /**
     * Returns a random question from the questions API.
     * @return {promise} representing a question object
     */
    questionService.getRandomQuestion = function () {
        return $http.get('/api/random');
    };

    /**
     * Deletes the question with [questionID] from the
     * server and returns a new random question.
     * @param  {number} questionID
     * @return {promise} representing a question object
     */
    questionService.deleteQuestion = function (questionID) {
        var confirmDelete = window.confirm(UITextService.CONFIRMATION_MESSAGE);
        var verify = '';

        if (confirmDelete) {
            $scope.deleteMessage = UITextService.PENDING_DELETE;

            if (utilityService.readCookie(appService.cookieNames.OWNED_QUESTIONS)) {
                var owned = utilityService.readCookie(appService.cookieNames.OWNED_QUESTIONS).split('|');

                for (var i = 0; i < owned.length; i++) {
                    if (questionID === owned[i].split(':')[0]) {
                        verify = owned[i].split(':')[1];
                    }
                }
            }

            $http.delete('/api/delete/' + questionID + '?verify=' + verify)
                .success(function () {
                    return $http.get('/api/random');
                });
        }

    };

    questionService.getAllQuestions = function () {};
    questionService.getReportedQuestions = function () {};
    questionService.createQuestion = function (question) {};

    return questionService;
});