myApp.directive('userappointments', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_userAppointments.html',
        scope: {
        },
        controller: ["$scope", "PageModelFactory", function ($scope, $window, PageModelFactory) {
            $scope.userAppointments = [];

            user = JSON.parse($rootScope.GetCookie("user"));
            function GetUserAppts(){
                $scope.userAppointments = [];
                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var tempAppt = $rootScope.pageModel.appointments[i];
                    if (tempAppt.userID == user.userID) {
                        $scope.userAppointments.push(tempAppt);
                    }
                }
            }
            GetUserAppts();
            $scope.CancelApptModal = function (appt) {
                $scope.ApptSelected = appt;
                $('.ui.cancelAppt.modal').modal({ detachable: false }, { onDeny: function () { $('.ui.cancelAppt.modal').modal('hide all'); } }, { blurring: true }).modal('show');
                $scope.appttime = appt.scheduledate;
            }

            $scope.CancelAppt = function () {
                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var tempAppt = $rootScope.pageModel.appointments[i];
                    if (tempAppt == $scope.ApptSelected) {
                        $rootScope.pageModel.appointments.splice(i, 1);
                        $rootScope.SetPageModel();
                        GetUserAppts();
                        $('.ui.cancelAppt.modal').modal('hide all');
                    }
                }
            }
            $scope.GoToScheduler = function () {

                $rootScope.LoadPage('<scheduler></scheduler>', '</scheduler>');
            }


        }]

    }
});
