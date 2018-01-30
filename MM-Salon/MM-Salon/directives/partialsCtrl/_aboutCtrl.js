myApp.directive('about', function ($rootScope, $compile) {
    return {
        templateUrl: 'directives/partials/_about.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {
            //$scope.aboutUs = $rootScope.pageModel.homePage.aboutUsTxt.replace('\n', '<br/>');
    

        }]

    }
});