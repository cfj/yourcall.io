angular.module('yourcall:app').controller('NotFoundCtrl', function ($scope, questionService) {
    
    var vm = this;

    questionService.getRandomQuestion().then(function (response) {
        vm.questionUrl = response.data;
    });

});