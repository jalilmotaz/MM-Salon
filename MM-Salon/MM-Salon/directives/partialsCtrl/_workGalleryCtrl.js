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
        }]

    }
});