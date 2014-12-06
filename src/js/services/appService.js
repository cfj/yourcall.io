angular.module('yourcall:services').factory('appService', function () {

    var appService = {
        cookieNames: {
            OWNED_QUESTIONS: 'own_q',
            VOTES: 'votes'
        },
        TITLE_THRESHOLD: 37,
        OPTION_THRESHOLD: 50
    };

    return appService;
});