myApp.directive('userappointments', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_userAppointments.html',
        scope: {
        },
        controller: ["$scope", function ($scope, $window) {
            $scope.userAppointments = [];

            user = JSON.parse($rootScope.GetCookie("user"));

            for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                var tempAppt = $rootScope.pageModel.appointments[i];
                if (tempAppt.userID == user.userID) {
                    $scope.userAppointments.push(tempAppt);
                }
            }
 

            $scope.CancelApptModal = function (appt) {
                $scope.ApptSelected = appt;
                $('.ui.cancelAppt.modal').modal({ onDeny: function () { $('.ui.editUser.modal').modal('hide all'); } }, { blurring: true }).modal('show');
            }

            $scope.EditApptModal = function (appt) {
                $scope.ApptSelected = appt;

                $('.ui.editAppt.modal').modal({ onDeny: function () { $('.ui.editUser.modal').modal('hide all'); } }, { blurring: true }).modal('show');

            }

        }]

    }
});
