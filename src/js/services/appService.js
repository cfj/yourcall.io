angular.module('yourcall:services').factory('appService', function () {

    var appService = {
        cookieNames: {
            OWNED_QUESTIONS: 'own_q',
            VOTES: 'votes'
        },
        TITLE_THRESHOLD: 37,
        OPTION_THRESHOLD: 50,
        DISPLAY_PERCENTAGES_DELAY: 1500,
        DISPLAY_BUTTON_ANIMATION_DELAY: 5000
    };

    return appService;
});