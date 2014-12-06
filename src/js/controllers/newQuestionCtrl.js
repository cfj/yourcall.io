angular.module('yourcall:app').controller('NewQuestionCtrl', function ($scope, $location, pageService, questionService, UITextService, appService) {
    
    pageService.setTitle(UITextService.titles.NEW_QUESTION);

    $scope.submitted = false;
    $scope.errorMessage = '';
    $scope.formData = {};
    $scope.formData.isPrivate = false;

    $scope.createQuestion = function () {
        if ($scope.formData.title && $scope.formData.option_1 && $scope.formData.option_2) {
            if ($scope.formData.title.length > appService.TITLE_THRESHOLD) {
                $scope.errorMessage = UITextService.ERROR_LONG_QUESTION;
            } else if ($scope.formData.option_1.length > appService.OPTION_THRESHOLD || $scope.formData.option_2.length > appService.OPTION_THRESHOLD) {
                $scope.errorMessage = UITextService.ERROR_LONG_OPTION;
            } else {
                $scope.submitted = true;
                $scope.errorMessage = '';

                questionService.createQuestion($scope.formData).success(function (data) {
                    $scope.formData = {};
                    $scope.newQuestion = data;
                    $location.path('/' + data.url);
                });
            }
        } else {
            $scope.errorMessage = UITextService.ERROR_FIELDS_EMPTY;
        }
    };

});