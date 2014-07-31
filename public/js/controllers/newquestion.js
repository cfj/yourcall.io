app.controller('NewQuestionCtrl', ['$scope', '$http', '$location', 'Page', function ($scope, $http, $location, Page) {
    Page.setTitle('Ask a question');
    $scope.submitted = false;
    $scope.errorMessage = '';

    var TITLE_THRESHOLD = 37,
        OPTION_THRESHOLD = 50;

    //The object that will hold the data for a new question
    $scope.formData = {};
    $scope.formData.isPrivate = false;


    //Post a new question to the server
    $scope.createQuestion = function () {
        if ($scope.formData.title && $scope.formData.option_1 && $scope.formData.option_2) {
            if ($scope.formData.title.length > TITLE_THRESHOLD) {
                $scope.errorMessage = 'Please try to shorten your question.';
            } else if ($scope.formData.option_1.length > OPTION_THRESHOLD || $scope.formData.option_2.length > OPTION_THRESHOLD) {
                $scope.errorMessage = 'Please try to shorten your options.'
            } else {
                $scope.submitted = true;
                //Remove any error message
                $scope.errorMessage = '';
                $http.post('/api/questions', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {};
                        $scope.newQuestion = data;
                        //Add the created question to the questions array and redirect to it
                        $scope.questions.push(data);
                        $location.path('/' + data.url);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    }); 
            }
        } else {
            $scope.errorMessage = 'Please fill in all fields.';
        }
    };

}]);