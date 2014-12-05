angular.module('yourcall:services').factory('UITextService', function () {

    var UITextService = {
        BASE_PAGE_TITLE: 'YourCall.io',
        QUESTION_PAGE_TITLE: 'Your Call: ',
        CONFIRMATION_MESSAGE: 'Are you sure?',
        PENDING_DELETE: 'Deleting...'
    };

    return UITextService;

});