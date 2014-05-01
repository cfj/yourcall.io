app.controller('MainCtrl', ['$scope', '$http', '$location', 'Page', function ($scope, $http, $location, Page) {

    //The object that will hold the data for a new question
    $scope.formData = {};
    $scope.formData.isPrivate = false;
    $scope.Page = Page;
    //successfull submission
    $scope.success = false;
    $scope.errorMessage = '';

    $scope.questions = [];

    $http.get('/api/random')
        .success(function (data) {
            $scope.questions = [];
            $scope.questions.push(data[0]);
            $scope.question = $scope.questions[0];
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    //Post a new question to the server
    $scope.createQuestion = function () {
        if ($scope.formData.title && $scope.formData.option_1 && $scope.formData.option_2) {
            if ($scope.formData.title.length > 37) {
                $scope.errorMessage = 'Please try to shorten your question.';
            } else if ($scope.formData.option_1.length > 50 || $scope.formData.option_2.length > 50) {
                $scope.errorMessage = 'Please try to shorten your options.'
            } else {
                $http.post('/api/questions', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {};
                        $scope.success = true;
                        $scope.error = false;
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