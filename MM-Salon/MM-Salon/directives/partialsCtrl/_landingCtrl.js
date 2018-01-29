myApp.directive('landing', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_landing.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {

            $scope.currentIndex = 0;
            $scope.setCurrentSlideIndex = function (index) {
                $scope.currentIndex = index;
            };
            $scope.isCurrentSlideIndex = function (index) {
                return $scope.currentIndex === index;
            };
            $scope.prevSlide = function () {
                $scope.currentIndex = ($scope.currentIndex < $rootScope.pageModel.homePage.imgSlides.length - 1) ? ++$scope.currentIndex : 0;
            };
            $scope.nextSlide = function () {
                $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $rootScope.pageModel.homePage.imgSlides.length - 1;
            };


           
        }]

    }
});

myApp.animation('.slide-animation', function () {
    return {
        addClass: function (element, className, done) {
            if (className == 'ng-hide') {
                TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            if (className == 'ng-hide') {
                element.removeClass('ng-hide');
                TweenMax.set(element, { left: element.parent().width() });
                TweenMax.to(element, 0.5, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
});