angular.module('yourcall:directives').directive('slideGraph', function($timeout) {

    return {
        restrict: 'A',
        scope: {
            voted: '@'
        },
        link: function(scope, element, attrs) {

            var result1    = document.getElementById('result-1'),
                result2    = document.getElementById('result-2'),
                option1    = document.querySelector('.option-1'),
                option2    = document.querySelector('.option-2'),
                nextButton = document.getElementById('next-button'),
                result1Value,
                result2Value;

            scope.$watch('voted', function(hasVoted) {
               
                var slide = function () {
                    $timeout(function() {
                        result1Value = result1.textContent.replace('%', '') + 'vh',
                        result2Value = result2.textContent.replace('%', '') + 'vh';

                        option1.style.height = result1Value;
                        option2.style.height = result2Value;
                    }, 100);

                    $timeout(function() {
                        result1.classList.add('show-percentage');
                        result2.classList.add('show-percentage');
                    }, 1500);

                    $timeout(function() {
                        nextButton.classList.add('shake-rotate');
                    }, 5000);
                }

                if (hasVoted) {
                    slide();
                } else {
                    element.on('click', function() {
                        if(hasVoted) {
                            slide();
                        }
                    });
                }

            });
        }
    }
});