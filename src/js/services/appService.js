angular.module('yourcall:services').factory('appService', function () {

    var appService = {
        cookieNames: {
            OWNED_QUESTIONS: 'own_q',
            VOTES: 'votes'
        }
    };

    return appService;

});