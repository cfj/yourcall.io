angular.module('yourcall:services', []);
angular.module('yourcall:directives', []);

angular.module('yourcall:app', ['yourcall:services', 'yourcall:directives', 'ngRoute'])
.config(function ($routeProvider, $locationProvider) {
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
});