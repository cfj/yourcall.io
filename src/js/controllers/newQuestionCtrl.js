angular.module('yourcall:app').controller('NewQuestionCtrl', function ($scope, $location, pageService, questionService, UITextService, appService) {
    
    var vm = this;

    pageService.setTitle(UITextService.titles.NEW_QUESTION);

    vm.submitted = false;
    vm.errorMessage = '';
    vm.formData = {};
    vm.formData.isPrivate = false;

    vm.createQuestion = function () {
        if (vm.formData.title && vm.formData.option_1 && vm.formData.option_2) {
            if (vm.formData.title.length > appService.TITLE_THRESHOLD) {
                vm.errorMessage = UITextService.ERROR_LONG_QUESTION;
            } else if (vm.formData.option_1.length > appService.OPTION_THRESHOLD || vm.formData.option_2.length > appService.OPTION_THRESHOLD) {
                vm.errorMessage = UITextService.ERROR_LONG_OPTION;
            } else {
                vm.submitted = true;
                vm.errorMessage = '';

                questionService.createQuestion(vm.formData).success(function (data) {
                    vm.formData = {};
                    vm.newQuestion = data;
                    $location.path('/q/' + data.url);
                });
            }
        } else {
            vm.errorMessage = UITextService.ERROR_FIELDS_EMPTY;
        }
    };

});