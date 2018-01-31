myApp.directive('scheduler', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_scheduler.html',
        scope: {
        },
        controller: ["$scope", function ($scope ) {
          

            //These variables MUST be set as a minimum for the calendar to work
            $scope.calendarView = 'month';
            $scope.viewDate = new Date();
            $scope.timespanClicked = function (date) {
                alert( date);
            };

            $scope.cellModifier = function (cell) {
                cell.cssClass = 'custom-template-cell';
            };

        }]

    }
});