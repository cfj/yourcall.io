angular.module('yourcall:services').factory('UITextService', function () {

    var UITextService = {
        titles: {
            BASE_PAGE_TITLE: 'YourCall.io',
            QUESTION_PAGE_TITLE: 'Your Call: ',
            NEW_QUESTION: 'Ask a question'
        },
        CONFIRMATION_MESSAGE: 'Are you sure?',
        DELETE: 'Delete',
        PENDING_DELETE: 'Deleting...',
        REPORT: 'Report',
        REPORTED: 'Flagged for review',
        ERROR_LONG_QUESTION: 'Please try to shorten your question.',
        ERROR_LONG_OPTION: 'Please try to shorten your options.',
        ERROR_FIELDS_EMPTY: 'Please fill in all fields.'
    };

    return UITextService;
});