myApp.directive('gallery', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_workgallery.html',
        scope: {
        },
        controller: ["$scope", function ($scope,$window) {

            $scope.showModal = function (src) {
                $scope.src = src;
                $('.imgModal').modal('show');
             }

            
            var tempArr = [];
            $scope.AllItems = [];

            for (var i = 0; i < $rootScope.pageModel.homePage.workGallery.length; i++) {
                var url = $rootScope.pageModel.homePage.workGallery[i];
                tempArr.push(url);
                if ((i + 1) % 4 == 0) {
                    $scope.AllItems.push(tempArr);
                    tempArr = [];
                }

            }

            if (tempArr.length != 0) {
                $scope.AllItems.push(tempArr);
            }
  
        

     

            $scope.currentIndex = 0;
            $scope.direction = 'left';

            $scope.setCurrentSlideIndex = function (index) {
                $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
                $scope.currentIndex = index;
            };
            $scope.isCurrentSlideIndex = function (index) {
                return $scope.currentIndex === index;
            };
            $scope.prevSlide = function () {
                $scope.direction = 'left';
                $scope.currentIndex = ($scope.currentIndex < $scope.AllItems.length - 1) ? ++$scope.currentIndex : 0;
            };
            $scope.nextSlide = function () {
                $scope.direction = 'right';
                $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.AllItems.length - 1;
            };

           



        }]

    }
});


            myApp.animation('.slide-animation', function () {
                return {
                    addClass: function (element, className, done) {
                        var scope = element.scope();
                        if (className == 'ng-hide') {
                            var finishPoint = element.parent().width();
                            if (scope.direction !== 'right') {
                                finishPoint = -finishPoint;
                            }
                            TweenMax.to(element, 0.5, { left: finishPoint, onComplete: done });

                        }
                        else {
                            done();
                        }
                    },
                    removeClass: function (element, className, done) {
                        var scope = element.scope();
                        if (className == 'ng-hide') {
                            element.removeClass('ng-hide');
                            var startPoint = element.parent().width();
                            if (scope.direction === 'right') {
                                startPoint = -startPoint;
                            }
                            TweenMax.set(element, { left: startPoint });
                            TweenMax.to(element, 0.5, { left: 0, onComplete: done });

                        }
                        else {
                            done();
                        }
                    }
                };
            });