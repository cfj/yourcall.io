angular.module('yourcall:services').factory('pageService', function (UITextService){

    var pageService = {};

    var title = UITextService.BASE_PAGE_TITLE;

    pageService.getTitle = function () {
        return title;
    };

    pageService.setTitle = function (pageTitle) {
        title = UITextService.QUESTION_PAGE_TITLE + pageTitle;
    };

    return pageService;
});