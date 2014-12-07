angular.module('yourcall:directives').directive('siteFooter', function ($rootScope, $location) {

    return {
        restrict: 'E',
        templateUrl: '/partials/directives/sitefooter.html',
        link: function(scope, element, attrs) {
            $rootScope.$on('$routeChangeSuccess', function () {
                if($location.path().indexOf('notfound') > -1) {
                    element.addClass('hidden');
                } else {
                    element.removeClass('hidden');
                }
            });
        }
    }
});