angular.module('yourcall:services', []);
angular.module('yourcall:directives', []);

angular.module('yourcall:app', ['yourcall:services', 'yourcall:directives', 'ngRoute', 'ngCookies'])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/singlequestion.html'
        })
        .when('/ask', {
            templateUrl: '/partials/newquestion.html',
            controller: 'NewQuestionCtrl',
            controllerAs: 'vm'
        })
        .when('/q/:question_url', {
            templateUrl: '/partials/singlequestion.html',
            controller: 'SingleQuestionCtrl',
            controllerAs: 'vm'
        })
        .when('/q/:question_url/result', {
            templateUrl: '/partials/singlequestion.html',
            controller: 'SingleQuestionCtrl',
            controllerAs: 'vm'
        })
        .when('/oops/notfound', {
            templateUrl: '/partials/notfound.html',
            controller: 'NotFoundCtrl'
        });

    $locationProvider.html5Mode(true);
})
.run(function ($rootScope, $window, $location) {
    //Google Analytics page tracking
    $rootScope.$on('$viewContentLoaded', function(event) {
        $window.ga('send', 'pageview', { page: $location.path() });
    });
});