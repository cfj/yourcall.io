app.controller('SingleQuestionCtrl', ['$scope', '$routeParams', '$http', '$location', '$window', 'Page', function ($scope, $routeParams, $http, $location, $window, Page) {

    $http.get('/api/random')
        .success(function (data) {
            $scope.nextQuestion = data[0];
            $scope.questions.push(data[0]);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.ownedQuestion = false;
    if (!$routeParams.question_url) {
        //$scope.question = $scope.questions[0];
        getTotalVotes();
    } else {
        $scope.question = $scope.questions.filter(function (question) {
            return question.url === $routeParams.question_url;
        })[0];

        //if question is not in the already fetched list of questions, hit the server
        //this is if you're coming in through a direct link to a question
        if (!$scope.question) {
            $http.get('/api/questions/' + $routeParams.question_url)
                .success(function (data) {
                    //Add the question to the list
                    $scope.questions.unshift(data);
                    //Set the current question to the one requested
                    $scope.question = data;
                    getTotalVotes();
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    $location.path('/oops/notfound');
                });
        } else {
            getTotalVotes();
        }
    }

    //Send a PUT request to the server to increment the vote count for the question
    $scope.vote = function (question, vote) {
        var index = $scope.questions.indexOf(question);

        $scope.question = $scope.questions[index];

        if (!$scope.question.hasVoted) {
            $http.put('/api/vote/' + question._id + '/' + vote)
                .success(function (data) {
                    //Update the vote count on the model if the vote was successful
                    if (data.success === 'true') {
                        $scope.questions[index]['option_' + vote + '_votes'] += 1;
                        $scope.questions[index].selection = vote;
                        $scope.questions[index].hasVoted = true;
                        getTotalVotes();
                    }
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });            
        }
    };

    $scope.deleteMessage = 'Delete';
    $scope.deleteQuestion = function (id) {

        var confirmed = window.confirm('Are you sure?');

        if (confirmed) {
            $scope.deleteMessage = 'Deleting...';
            var verify = '';

            if (readCookie('own_q')) {
                var owned = readCookie('own_q').split('|');

                for (var i = 0; i < owned.length; i++) {
                    if (id === owned[i].split(':')[0]) {
                        verify = owned[i].split(':')[1];
                    }
                }
            }

            $http.delete('/api/delete/' + id + '?verify=' + verify)
                .success(function () {
                    //Måste ta bort cookien för frågan, för att inte göra cookien för stor
                    //Hämta en ny fråga och redirecta dit - kan inte förlita mig på nextQuestion eftersom det kan vara samma fråga som den man raderar
                    $http.get('/api/random')
                        .success(function (data) {
                            $location.path('/' + data[0].url)
                        })
                        .error(function (data) {
                            console.log('Error: ' + data);
                        });

                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }

    };

    $scope.reportMessage = 'Report';
    $scope.reportQuestion = function (id) {
        $scope.reportMessage = 'Flagged for review'
        $http.put('/api/report/' + id)
            .success(function (data) {

            });
    };

    function readCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');

        for (var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
    }

    
    function getTotalVotes () {
        var ownedQuestions = '',
            votedQuestions = readCookie('votes');

        if (readCookie('own_q')) {
            var owned = readCookie('own_q').split('|');

            for (var i = 0; i < owned.length; i++) {
                ownedQuestions += ':' + owned[i].split(':')[0];
            }
        }

        Page.setTitle($scope.question.title);

        if (votedQuestions && votedQuestions.indexOf($scope.question._id) > -1) {
            $scope.question.hasVoted = true;
        }

        if (ownedQuestions.indexOf($scope.question._id) > -1) {
            $scope.ownedQuestion = true;
        }

        $scope.totalVotes = $scope.question.option_1_votes + $scope.question.option_2_votes;

    }

    //Google Analytics page tracking
    $scope.$on('$viewContentLoaded', function(event) {
        $window.ga('send', 'pageview', { page: $location.path() });
    });

}]);