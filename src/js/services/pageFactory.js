angular.module('yourcall:services').factory('pageService', function (appService){

    var pageService = {};

    var title = appService.BASE_PAGE_TITLE;

    pageService.getTitle = function () {
        return title;
    };

    pageService.setTitle = function (pageTitle) {
        title = appService.QUESTION_PAGE_TITLE + pageTitle;
    };

    return pageService;
});