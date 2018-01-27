myApp.directive('gallery', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_workgallery.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {

            $scope.showModal = function (src) {
                $scope.src = src;
                $('.ui.basic.modal').modal('show');
                
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

        
        }]

    }
});