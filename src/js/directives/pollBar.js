angular.module('yourcall:directives').directive('pollBar', function($timeout, appService) {

    return {
        restrict: 'A',
        scope: {
            voted: '@',
            showResult: '='
        },
        link: function(scope, element, attrs) {

            var result1    = document.getElementById('result-1'),
                result2    = document.getElementById('result-2'),
                option1    = document.querySelector('.option-1'),
                option2    = document.querySelector('.option-2'),
                nextButton = document.getElementById('next-button'),
                result1Value,
                result2Value;

            var setBarHeights = function () {
                result1Value = result1.textContent.replace('%', '') + 'vh',
                result2Value = result2.textContent.replace('%', '') + 'vh';

                option1.style.height = result1Value;
                option2.style.height = result2Value;
            };

            var showPercentages = function () {
                result1.classList.add('show-percentage');
                result2.classList.add('show-percentage');
            };

            var nextQuestionCTA = function () {
                nextButton.classList.add('shake-rotate');
            };

            var displayResult = function () {
                $timeout(setBarHeights, 100);

                $timeout(showPercentages, appService.DISPLAY_PERCENTAGES_DELAY);

                $timeout(nextQuestionCTA, appService.DISPLAY_BUTTON_ANIMATION_DELAY);
            };

            if(!scope.showResult) {
                scope.$watch('voted', function(hasVoted) {
                    if (hasVoted) {
                        displayResult();
                    } else {
                        element.on('click', displayResult);
                    }
                });
            } else {
                displayResult();
            }
        }
    }
});