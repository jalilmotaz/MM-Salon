myApp.directive('scheduler', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_scheduler.html',
        scope: {
        },
        controller: ["$scope","PageModelFactory" ,function ($scope, PageModelFactory,$watch) {
          
            $(document).ready(function () {
                $('.ui.dropdown').dropdown();

                var openTime = "9:00:00";
                var closeTime = "19:00:00";

                var timeStart = new Date("01/01/2007 " + openTime).getHours();
                var timeEnd = new Date("01/01/2007 " + closeTime).getHours();

                for (var i = timeStart; i < timeEnd; i++) {
                    if (i > 12) {
                        $scope.ddlTime.push(tConvert(i + ":00"));
                        $scope.ddlTime.push(tConvert(i + ":30"));
                    }
                    else {
                        $scope.ddlTime.push(i + ":00 AM");
                        $scope.ddlTime.push(i + ":30 AM");
                    }
                }
              
            });

            //These variables MUST be set as a minimum for the calendar to work
            $scope.calendarView = 'month';
            $scope.viewDate = new Date();
            $scope.timespanClicked = function (date) {
                $(".ui.schedule.modal").modal({ blurring: true }).modal('show');
                $scope.dateSelected = formatDate(new Date(date));
            };

            $scope.cellModifier = function (cell) {
                if (cell.label % 2 === 1 && cell.inMonth) {
                    cell.cssClass = 'custom-template-cell';
                }
                
            };

            function formatDate(d) {
                d = new Date(d);
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var output = (('' + month).length < 2 ? '0' : '') + month + '/' +
                 (('' + day).length < 2 ? '0' : '') + day + '/' +
                d.getFullYear();
                return output;
            }
        

            function tConvert(time) {
                // Check correct time format and split into components
                time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

                if (time.length > 1) { // If time format correct
                    time = time.slice(1);  // Remove full string match value
                    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                    time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                return time.join(''); // return adjusted time or original string
            }

      
            $scope.ddlTime = [];
        
            $scope.Holidays = ["2/1/2018", "3/15/2018"];

            $scope.seats = "5";

        
            $scope.ScheduleAppointment = function () {
                var createdDate = $rootScope.GetFormattedDate();

                var scheduledDate = $scope.dateSelected +" " + $scope.timeSelected;
                
                var note = $scope.note;

                var userID = $rootScope.GetCookie("userID");


                var url = "api/WebAPI/ScheduleAppointment/post";
                var data = createdDate + "|sep|" + scheduledDate + "|sep|" + note + "|sep|" + userID;
                PageModelFactory.Post(url, data).then(function (res) {
                    $rootScope.isLoading = false;
                    $rootScope.ShowToast("Scheudled Appointment", "limegreen");
                    $rootScope.dateSelected = "";
                    $rootScope.timeSelected = "";
                });

            }

            $scope.GoToLogin = function () {
                $rootScope.LoadPage('<userlogin></userlogin>', '</userlogin>');
                $(".ui.schedule.modal").modal('hide');
            }

            $scope.disableSchedule = ($scope.timeSelected == undefined || $scope.timeSelected =="") ?true : false;
            $scope.$watch('timeSelected', function () {
                $scope.disableSchedule = ($scope.timeSelected == undefined || $scope.timeSelected == "") ? true : false;

            });
        }]

    }
});