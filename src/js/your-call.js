var app = angular.module('yourCall', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/singlequestion.html'
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
}]);;var app = angular.module('yourCall', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/singlequestion.html'
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
}]);;app.controller('AllCtrl', ['$scope', '$http', function ($scope, $http) {
    
    $http.get('/api/questions')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    
}]);;app.controller('MainCtrl', ['$scope', '$http', '$location', 'pageFactory', function ($scope, $http, $location, pageFactory) {

    $scope.page = pageFactory;

    $scope.questions = [];

    $http.get('/api/random')
        .success(function (data) {
            //$scope.questions = [];
            $scope.questions.push(data[0]);
            $scope.question = $scope.questions[0];
            
            if ($location.path() === '/') {
                $location.path('/' + $scope.question.url);
            }

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });



}]);;app.controller('NewQuestionCtrl', ['$scope', '$http', '$location', 'pageFactory', function ($scope, $http, $location, pageFactory) {
    pageFactory.setTitle('Ask a question');
    $scope.submitted = false;
    $scope.errorMessage = '';

    var TITLE_THRESHOLD = 37,
        OPTION_THRESHOLD = 50;

    //The object that will hold the data for a new question
    $scope.formData = {};
    $scope.formData.isPrivate = false;


    //Post a new question to the server
    $scope.createQuestion = function () {
        if ($scope.formData.title && $scope.formData.option_1 && $scope.formData.option_2) {
            if ($scope.formData.title.length > TITLE_THRESHOLD) {
                $scope.errorMessage = 'Please try to shorten your question.';
            } else if ($scope.formData.option_1.length > OPTION_THRESHOLD || $scope.formData.option_2.length > OPTION_THRESHOLD) {
                $scope.errorMessage = 'Please try to shorten your options.'
            } else {
                $scope.submitted = true;
                //Remove any error message
                $scope.errorMessage = '';
                $http.post('/api/questions', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {};
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

}]);;app.controller('ReportedCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/reported')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });    
}]);;app.controller('SingleQuestionCtrl', ['$scope', '$routeParams', '$http', '$location', '$window', 'pageFactory', 'questionService', function ($scope, $routeParams, $http, $location, $window, pageFactory, questionService) {

    questionService.getRandomQuestion()
        .success(function (data) {
            $scope.nextQuestion = data[0];
            console.log(data);
        });

    $scope.ownedQuestion = false;
    if (!$routeParams.question_url) {
        initQuestion();
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
                    initQuestion();
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    $location.path('/oops/notfound');
                });
        } else {
            initQuestion();
        }
    }

    //Send a PUT request to the server to increment the vote count for the question
    $scope.vote = function (question, vote) {
        var index = $scope.questions.indexOf(question);

        $scope.question = $scope.questions[index];

        if (!$scope.question.hasVoted) {
            $http.put('/api/vote/' + question.url + '/' + vote)
                .success(function (data) {
                    //Update the vote count on the model if the vote was successful
                    if (data.success === 'true') {
                        $scope.questions[index]['option_' + vote + '_votes'] += 1;
                        $scope.questions[index].selection = vote;
                        $scope.questions[index].hasVoted = true;
                        initQuestion();
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

    
    function initQuestion() {
        var ownedQuestions = '',
            votedQuestions = readCookie('votes');

        if (readCookie('own_q')) {
            var owned = readCookie('own_q').split('|');

            for (var i = 0; i < owned.length; i++) {
                ownedQuestions += ':' + owned[i].split(':')[0];
            }
        }

        pageFactory.setTitle($scope.question.title);

        if (votedQuestions && votedQuestions.indexOf($scope.question.url) > -1) {
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

}]);;app.directive('selfRefresh', ['$location', '$route', function($location,$route){
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                $route.reload();
            }
        });
    }   
}]);;app.directive('slideGraph', ['$timeout', function($timeout) {

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
}]);;app.factory('pageFactory', function(){
  var title = 'YourCall.io';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = 'Your Call: ' + newTitle; }
  };
});;angular.module('yourCall').factory('questionService', ['$http', function ($http) {
    var questionService = {};

    questionService.getRandomQuestion = function () {
        return $http.get('/api/random');
    };

    questionService.getAllQuestions = function () {};
    questionService.getReportedQuestions = function () {};
    questionService.deleteQuestion = function (questionID) {};
    questionService.createQuestion = function (question) {};

    return questionService;
}]);;/*! yourcall 24-09-2014 */
var app=angular.module("yourCall",["ngRoute"]);app.config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"/partials/singlequestion.html"}).when("/ask",{templateUrl:"/partials/newquestion.html",controller:"NewQuestionCtrl"}).when("/:question_url",{templateUrl:"partials/singlequestion.html",controller:"SingleQuestionCtrl"}).when("/oops/notfound",{templateUrl:"/partials/notfound.html"}),b.html5Mode(!0)}]),app.controller("AllCtrl",["$scope","$http",function(a,b){b.get("/api/questions").success(function(b){a.questions=b}).error(function(a){console.log("Error: "+a)})}]),app.controller("MainCtrl",["$scope","$http","$location","pageFactory",function(a,b,c,d){a.page=d,a.questions=[],b.get("/api/random").success(function(b){a.questions.push(b[0]),a.question=a.questions[0],"/"===c.path()&&c.path("/"+a.question.url)}).error(function(a){console.log("Error: "+a)})}]),app.controller("NewQuestionCtrl",["$scope","$http","$location","pageFactory",function(a,b,c,d){d.setTitle("Ask a question"),a.submitted=!1,a.errorMessage="";var e=37,f=50;a.formData={},a.formData.isPrivate=!1,a.createQuestion=function(){a.formData.title&&a.formData.option_1&&a.formData.option_2?a.formData.title.length>e?a.errorMessage="Please try to shorten your question.":a.formData.option_1.length>f||a.formData.option_2.length>f?a.errorMessage="Please try to shorten your options.":(a.submitted=!0,a.errorMessage="",b.post("/api/questions",a.formData).success(function(b){a.formData={},a.newQuestion=b,a.questions.push(b),c.path("/"+b.url)}).error(function(a){console.log("Error: "+a)})):a.errorMessage="Please fill in all fields."}}]),app.controller("ReportedCtrl",["$scope","$http",function(a,b){b.get("/api/reported").success(function(b){a.questions=b}).error(function(a){console.log("Error: "+a)})}]),app.controller("SingleQuestionCtrl",["$scope","$routeParams","$http","$location","$window","pageFactory","questionService",function(a,b,c,d,e,f,g){function h(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1,e.length);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return null}function i(){var b="",c=h("votes");if(h("own_q"))for(var d=h("own_q").split("|"),e=0;e<d.length;e++)b+=":"+d[e].split(":")[0];f.setTitle(a.question.title),c&&c.indexOf(a.question.url)>-1&&(a.question.hasVoted=!0),b.indexOf(a.question._id)>-1&&(a.ownedQuestion=!0),a.totalVotes=a.question.option_1_votes+a.question.option_2_votes}g.getRandomQuestion().success(function(b){a.nextQuestion=b[0],console.log(b)}),a.ownedQuestion=!1,b.question_url?(a.question=a.questions.filter(function(a){return a.url===b.question_url})[0],a.question?i():c.get("/api/questions/"+b.question_url).success(function(b){a.questions.unshift(b),a.question=b,i()}).error(function(a){console.log("Error: "+a),d.path("/oops/notfound")})):i(),a.vote=function(b,d){var e=a.questions.indexOf(b);a.question=a.questions[e],a.question.hasVoted||c.put("/api/vote/"+b.url+"/"+d).success(function(b){"true"===b.success&&(a.questions[e]["option_"+d+"_votes"]+=1,a.questions[e].selection=d,a.questions[e].hasVoted=!0,i())}).error(function(a){console.log("Error: "+a)})},a.deleteMessage="Delete",a.deleteQuestion=function(b){var e=window.confirm("Are you sure?");if(e){a.deleteMessage="Deleting...";var f="";if(h("own_q"))for(var g=h("own_q").split("|"),i=0;i<g.length;i++)b===g[i].split(":")[0]&&(f=g[i].split(":")[1]);c.delete("/api/delete/"+b+"?verify="+f).success(function(){c.get("/api/random").success(function(a){d.path("/"+a[0].url)}).error(function(a){console.log("Error: "+a)})}).error(function(a){console.log("Error: "+a)})}},a.reportMessage="Report",a.reportQuestion=function(b){a.reportMessage="Flagged for review",c.put("/api/report/"+b).success(function(){})},a.$on("$viewContentLoaded",function(){e.ga("send","pageview",{page:d.path()})})}]),app.directive("selfRefresh",["$location","$route",function(a,b){return function(c,d){d.bind("click",function(){d[0]&&d[0].href&&d[0].href===a.absUrl()&&b.reload()})}}]),app.directive("slideGraph",["$timeout",function(a){return{restrict:"A",scope:{voted:"@"},link:function(b,c){b.$watch("voted",function(b){function d(){a(function(){e=g.textContent.replace("%","")+"vh",f=h.textContent.replace("%","")+"vh",i.style.height=e,j.style.height=f},100),a(function(){g.classList.add("show-percentage"),h.classList.add("show-percentage")},1500),a(function(){k.classList.add("shake-rotate")},5e3)}var e,f,g=document.getElementById("result-1"),h=document.getElementById("result-2"),i=document.querySelector(".option-1"),j=document.querySelector(".option-2"),k=document.getElementById("next-button");b?d():c.on("click",function(){b&&d()})})}}}]),app.factory("pageFactory",function(){var a="YourCall.io";return{title:function(){return a},setTitle:function(b){a="Your Call: "+b}}}),angular.module("yourCall").factory("questionService",["$http",function(a){var b={};return b.getRandomQuestion=function(){return a.get("/api/random")},b.getAllQuestions=function(){},b.getReportedQuestions=function(){},b.deleteQuestion=function(){},b.createQuestion=function(){},b}]);;app.controller('AllCtrl', ['$scope', '$http', function ($scope, $http) {
    
    $http.get('/api/questions')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
    
}]);;app.controller('MainCtrl', ['$scope', '$http', '$location', 'pageFactory', function ($scope, $http, $location, pageFactory) {

    $scope.page = pageFactory;

    $scope.questions = [];

    $http.get('/api/random')
        .success(function (data) {
            //$scope.questions = [];
            $scope.questions.push(data[0]);
            $scope.question = $scope.questions[0];
            
            if ($location.path() === '/') {
                $location.path('/' + $scope.question.url);
            }

        })
        .error(function (data) {
            console.log('Error: ' + data);
        });



}]);;app.controller('NewQuestionCtrl', ['$scope', '$http', '$location', 'pageFactory', function ($scope, $http, $location, pageFactory) {
    pageFactory.setTitle('Ask a question');
    $scope.submitted = false;
    $scope.errorMessage = '';

    var TITLE_THRESHOLD = 37,
        OPTION_THRESHOLD = 50;

    //The object that will hold the data for a new question
    $scope.formData = {};
    $scope.formData.isPrivate = false;


    //Post a new question to the server
    $scope.createQuestion = function () {
        if ($scope.formData.title && $scope.formData.option_1 && $scope.formData.option_2) {
            if ($scope.formData.title.length > TITLE_THRESHOLD) {
                $scope.errorMessage = 'Please try to shorten your question.';
            } else if ($scope.formData.option_1.length > OPTION_THRESHOLD || $scope.formData.option_2.length > OPTION_THRESHOLD) {
                $scope.errorMessage = 'Please try to shorten your options.'
            } else {
                $scope.submitted = true;
                //Remove any error message
                $scope.errorMessage = '';
                $http.post('/api/questions', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {};
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

}]);;app.controller('ReportedCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/reported')
        .success(function (data) {
            $scope.questions = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });    
}]);;app.controller('SingleQuestionCtrl', ['$scope', '$routeParams', '$http', '$location', '$window', 'pageFactory', 'questionService', function ($scope, $routeParams, $http, $location, $window, pageFactory, questionService) {

    questionService.getRandomQuestion()
        .success(function (data) {
            $scope.nextQuestion = data[0];
            console.log(data);
        });

    $scope.ownedQuestion = false;
    if (!$routeParams.question_url) {
        initQuestion();
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
                    initQuestion();
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    $location.path('/oops/notfound');
                });
        } else {
            initQuestion();
        }
    }

    //Send a PUT request to the server to increment the vote count for the question
    $scope.vote = function (question, vote) {
        var index = $scope.questions.indexOf(question);

        $scope.question = $scope.questions[index];

        if (!$scope.question.hasVoted) {
            $http.put('/api/vote/' + question.url + '/' + vote)
                .success(function (data) {
                    //Update the vote count on the model if the vote was successful
                    if (data.success === 'true') {
                        $scope.questions[index]['option_' + vote + '_votes'] += 1;
                        $scope.questions[index].selection = vote;
                        $scope.questions[index].hasVoted = true;
                        initQuestion();
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

    
    function initQuestion() {
        var ownedQuestions = '',
            votedQuestions = readCookie('votes');

        if (readCookie('own_q')) {
            var owned = readCookie('own_q').split('|');

            for (var i = 0; i < owned.length; i++) {
                ownedQuestions += ':' + owned[i].split(':')[0];
            }
        }

        pageFactory.setTitle($scope.question.title);

        if (votedQuestions && votedQuestions.indexOf($scope.question.url) > -1) {
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

}]);;app.directive('selfRefresh', ['$location', '$route', function($location,$route){
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                $route.reload();
            }
        });
    }   
}]);;app.directive('slideGraph', ['$timeout', function($timeout) {

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
}]);;app.factory('pageFactory', function(){
  var title = 'YourCall.io';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = 'Your Call: ' + newTitle; }
  };
});;angular.module('yourCall').factory('questionService', ['$http', function ($http) {
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