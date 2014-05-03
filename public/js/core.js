//http://scotch.io/tutorials/javascript/animating-angularjs-apps-ngview

var app = angular.module('yourCall', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/singlequestion.html',
            controller: 'MainCtrl'  //testa att ha mainctrl här
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
}]);