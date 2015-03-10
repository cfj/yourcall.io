angular.module('yourcall:services').factory('utilityService', function ($cookies) {

    var utilityService = {};

    utilityService.readCookie = function (name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');

        for (var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
    };

    utilityService.isVotedQuestion = function (url) {
        if (!localStorage.getItem('voted')) {
            return false;
        }

        var votedQuestions = angular.fromJson(localStorage.getItem('voted'));

        votedQuestions.forEach(function (question) {
            if (question.url === url) {
                return true;
            }
        });

        return false;
    };

    utilityService.getVote = function (url) {
        var votedQuestions = angular.fromJson(localStorage.getItem('voted'));

        votedQuestions.forEach(function (question) {
            if (question.url === url) {
                return question.selection;
            }
        });
    };

    utilityService.isOwnQuestion = function (url) {
        if (!localStorage.getItem('owned')) {
            return false;
        }

        var ownedQuestions = angular.fromJson(localStorage.getItem('owned'));

        return ownedQuestions.indexOf(url) > -1;
    };

    utilityService.addVotedQuestion = function (url, selection) {
        var votedQuestions = localStorage.getItem('voted') ? angular.fromJson(localStorage.getItem('voted')) : [];

        votedQuestions.push({
            url: url,
            selection: selection
        });

        localStorage.setItem('voted', angular.toJson(votedQuestions));
    };

    utilityService.addOwnQuestion = function (url) {
        var ownedQuestions = localStorage.getItem('owned') ? angular.fromJson(localStorage.getItem('owned')) : [];

        ownedQuestions.push(url);

        localStorage.setItem('owned', angular.toJson(votedQuestions));  
    };

    return utilityService;
});