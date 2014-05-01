//http://scotch.io/tutorials/javascript/animating-angularjs-apps-ngview

var app = angular.module('yourCall', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
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
        .when('/show/ruMiT6ZxWIwRKj4ktQSgddFnkYqqbX', {
            templateUrl: '/partials/vnONfNvVQrTa6UPRABNrz5mq1SBLMG.html',
            controller: 'AllCtrl'
        })
        .when('/show/reported', {
            templateUrl: '/partials/reported.html',
            controller: 'ReportedCtrl'
        })
        .when('/oops/notfound', {
            templateUrl: '/partials/notfound.html'
        });

    $locationProvider.html5Mode(true);
});

app.controller('AllCtrl', ['$scope', '$http', function ($scope, $http) {
    //Get all questions from the server (will have to update to only get like 5 or so)
    
    $http.get('/api/questions')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

        $scope.deleteQuestion = function (id) {
            $http.delete('/api/xn7qW7bSErR53kxBeRPbzD0JNtyE5b/' + id)
                .success(function () {
                    //Remove the deleted todo from the model if the delete was successful on the server
                    $scope.questions = _.reject($scope.questions, function (question) {
                        return question._id === id;
                    });
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    
}]);

app.controller('NewQuestionCtrl', ['$scope', '$http', 'Page', function ($scope, $http, Page) {
    Page.setTitle('Ask a question');
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

    $scope.deleteQuestion = function (id) {
        $http.delete('/api/xn7qW7bSErR53kxBeRPbzD0JNtyE5b/' + id)
            .success(function () {
                //Remove the deleted todo from the model if the delete was successful on the server
                $scope.questions = _.reject($scope.questions, function (question) {
                    return question._id === id;
                });
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    
}]);

app.factory('Page', function(){
  var title = 'YourCall.io';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = 'Your Call: ' + newTitle; }
  };
});


app.directive('slideGraph', function($timeout) {

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
                        slide();
                    });                    
                }

            });
        }
    }
});

app.directive('selfRefresh',function($location,$route){
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                $route.reload();
            }
        });
    }   
});