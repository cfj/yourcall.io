angular.module('yourcall:directives').directive('slideGraph', function($timeout) {

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
            
            var slide = function () {
                $timeout(setBarHeights, 100);

                $timeout(showPercentages, 1500);

                $timeout(nextQuestionCTA, 5000);
            };

            if(!scope.showResult) {
                scope.$watch('voted', function(hasVoted) {
                    if (hasVoted) {
                        slide();
                    } else {
                        element.on('click', slide);
                    }
                });
            } else {
                slide();
            }
        }
    }
});