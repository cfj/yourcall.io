//http://scotch.io/tutorials/javascript/animating-angularjs-apps-ngview

var app = angular.module('yourCall', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/singlequestion.html',
            controller: 'SingleQuestionCtrl'
        })
        .when('/ask', {
            templateUrl: '/partials/newquestion.html',
            controller: 'NewQuestionCtrl'
        })
        .when('/:question_url', {
            templateUrl: 'partials/singlequestion.html',
            controller: 'SingleQuestionCtrl'
        })
        .when('/oops/notfound', {
            templateUrl: '/partials/notfound.html'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('AllCtrl', ['$scope', '$http', function ($scope, $http) {
    //Get all questions from the server (will have to update to only get like 5 or so)
    
    $http.get('/api/questions')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    
}]);

app.controller('NewQuestionCtrl', ['$scope', '$http', '$location', 'Page', function ($scope, $http, $location, Page) {
    Page.setTitle('Ask a question');
    $scope.submitted = false;
    //successfull submission
    $scope.success = false;
    $scope.errorMessage = '';

    //The object that will hold the data for a new question
    $scope.formData = {};
    $scope.formData.isPrivate = false;


    //Post a new question to the server
    $scope.createQuestion = function () {
        if ($scope.formData.title && $scope.formData.option_1 && $scope.formData.option_2) {
            if ($scope.formData.title.length > 37) {
                $scope.errorMessage = 'Please try to shorten your question.';
            } else if ($scope.formData.option_1.length > 50 || $scope.formData.option_2.length > 50) {
                $scope.errorMessage = 'Please try to shorten your options.'
            } else {
                $scope.submitted = true;
                $scope.errorMessage = '';
                $http.post('/api/questions', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {};
                        $scope.success = true;
                        $scope.error = false;
                        $scope.newQuestion = data;
                        //Add the created question to the questions array and redirect to it
                        $scope.questions.push(data);
                        $location.path('/' + data.url);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    }); 
            }
        } else {
            $scope.errorMessage = 'Please fill in all fields.';
        }
    };

}]);

app.controller('ReportedCtrl', ['$scope', '$http', function ($scope, $http) {
    //Get all reported questions

    $http.get('/api/reported')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });    
}]);

app.factory('Page', function(){
  var title = 'YourCall.io';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = 'Your Call: ' + newTitle; }
  };
});


app.directive('slideGraph', ['$timeout', function($timeout) {

    return {
        restrict: 'A',
        scope: {
            voted: '@'
        },
        link: function(scope, element, attrs) {

            scope.$watch('voted', function (hasVoted) {
                
                var result1    = document.getElementById('result-1'),
                    result2    = document.getElementById('result-2'),
                    option1    = document.querySelector('.option-1'),
                    option2    = document.querySelector('.option-2'),
                    nextButton = document.getElementById('next-button'),
                    result1Value,
                    result2Value;    

                function slide () {
                    $timeout(function () {
                        result1Value = result1.textContent.replace('%', '') + 'vh',
                        result2Value = result2.textContent.replace('%', '') + 'vh';

                        option1.style.height = result1Value;
                        option2.style.height = result2Value;
                    }, 100);

                    $timeout(function() {
                        result1.classList.add('show-percentage');
                        result2.classList.add('show-percentage');
                    }, 1500);

                    $timeout(function() {
                        nextButton.classList.add('shake-rotate');
                    }, 5000);
                }

                if (hasVoted) {
                    slide();
                } else {
                    element.on('click', function() {
                        if(hasVoted) {
                            slide();
                        }
                    });                    
                }

            });
        }
    }
}]);

app.directive('selfRefresh', ['$location', '$route', function($location,$route){
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                $route.reload();
            }
        });
    }   
}]);;app.controller('MainCtrl', ['$scope', '$http', '$location', 'Page', function ($scope, $http, $location, Page) {


    $scope.Page = Page;


    $scope.questions = [];

    $http.get('/api/random')
        .success(function (data) {
            $scope.questions = [];
            $scope.questions.push(data[0]);
            $scope.question = $scope.questions[0];
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });



}]);;app.controller('SingleQuestionCtrl', ['$scope', '$routeParams', '$http', '$location', 'Page', function ($scope, $routeParams, $http, $location, Page) {

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

    $scope.deleteQuestion = function (id) {

        var confirmed = window.confirm('Are you sure?');

        if (confirmed) {
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
                    //Redirecta till start när frågan raderats
                    $location.path('/');
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
            console.log($scope.question.hasVoted ? 'You have voted already.' : 'You may vote on this.');
        }

        if (ownedQuestions.indexOf($scope.question._id) > -1) {
            $scope.ownedQuestion = true;
        }

        $scope.totalVotes = $scope.question.option_1_votes + $scope.question.option_2_votes;
    }

}]);