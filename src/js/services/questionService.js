angular.module('yourcall:services').factory('questionService',function ($http, $location, UITextService, utilityService, appService, pageService) {
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
     * @param  {number} questionId
     * @return {promise} representing a question object
     */
    questionService.deleteQuestion = function (questionId) {
        var confirmDelete = window.confirm(UITextService.CONFIRMATION_MESSAGE);
        var verify = '';

        if (confirmDelete) {
            if (utilityService.readCookie(appService.cookieNames.OWNED_QUESTIONS)) {
                var owned = utilityService.readCookie(appService.cookieNames.OWNED_QUESTIONS).split('|');

                for (var i = 0; i < owned.length; i++) {
                    if (questionId === owned[i].split(':')[0]) {
                        verify = owned[i].split(':')[1];
                    }
                }
            }

            //Fixa!
            $http.delete('/api/delete/' + questionId + '?verify=' + verify).success(function () {
                $http.get('/api/random');
            });
        }

    };

    questionService.getQuestion = function (questionUrl) {
        return $http.get('/api/questions/' + questionUrl)
            .success(function (question) {
                var ownedQuestions = '',
                    votedQuestions = utilityService.readCookie(appService.cookieNames.VOTES);

                if (utilityService.readCookie(appService.cookieNames.OWNED_QUESTIONS)) {
                    var owned = utilityService.readCookie(appService.cookieNames.OWNED_QUESTIONS).split('|');

                    for (var i = 0; i < owned.length; i++) {
                        ownedQuestions += ':' + owned[i].split(':')[0];
                    }
                }

                pageService.setTitle(question.title);

                
                if (votedQuestions && votedQuestions.indexOf(question.url) > -1) {
                    question.hasVoted = true;
                }

                if (ownedQuestions.indexOf(question._id) > -1) {
                    question.owned = true;
                }

                question.totalVotes = question.option_1_votes + question.option_2_votes;
            })
            .error(function () {
                $location.path('/oops/notfound');
            });
    };

    questionService.voteOnQuestion = function (question, vote) {
        if (!question.hasVoted) {
            return $http.put('/api/vote/' + question.url + '/' + vote).success(function (data) {
                if (data.success === 'true') {
                    question['option_' + vote + '_votes'] += 1;
                    question.hasVoted = true;
                }
            });          
        }
    };

    /**
     * Modifies the question, setting the reported flag to true.
     * @param  {number} questionId 
     * @return {undefined}
     */
    questionService.reportQuestion = function (questionId) {
        $http.put('/api/report/' + questionId);
    };

    questionService.createQuestion = function (newQuestion) {
        return $http.post('/api/questions', newQuestion);
    };

    questionService.getAllQuestions = function () {};
    questionService.getReportedQuestions = function () {};

    return questionService;
});