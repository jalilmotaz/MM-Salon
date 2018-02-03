myApp.directive('scheduler', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_scheduler.html',
        scope: {
        },
        controller: ["$scope","PageModelFactory" ,function ($scope, PageModelFactory,$watch) {
            $scope.pastDate = false;

            $(document).ready(function () {
                $('.ui.dropdown').dropdown();
                $(".ui.schedule.modal").modal({detachable: false  },{ onDeny: function () { $('.ui.schedule.modal').modal('hide'); } }, { blurring: true });

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
                        if (i == 12) {
                            $scope.ddlTime.push(i + ":00 PM");
                            $scope.ddlTime.push(i + ":30 PM");
                        }
                        else {
                            $scope.ddlTime.push(i + ":00 AM");
                            $scope.ddlTime.push(i + ":30 AM");
                        }
                      
                    }
                }
              
            });

            //These variables MUST be set as a minimum for the calendar to work
            $scope.calendarView = 'month';
            $scope.viewDate = new Date();
            $scope.timespanClicked = function (date) {
                $scope.timeSelected = "";
                $(".ui.schedule.modal").modal("show");
            
                $scope.dateSelected = formatDate(new Date(date));

                var selectedDate = new Date($scope.dateSelected);
                var now = new Date();

                now.setHours(0, 0, 0, 0);

                if (selectedDate < now) {
                    $scope.pastDate = true;
                }
                else {
                    $scope.pastDate = false;

                }
              
                for (var i = 0; i < $rootScope.Holidays.length; i++) {

                    var closedDay = $rootScope.Holidays[i];
                    if (closedDay == $scope.dateSelected) {
                        $scope.closedDay = true;
                        break;
                    }
                    else {

                        $scope.closedDay = false;
                    }

                }
                $scope.apptsForSelectedDate = [];
                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var temp = $rootScope.pageModel.appointments[i];
                    
                    if (temp.scheduledate.split(' ')[0] == $scope.dateSelected) {
                        $scope.apptsForSelectedDate.push(temp);

                    }

                }
                $scope.timesAvaliable = [];

                for (var j = 0; j < $scope.ddlTime.length; j++) {
                    var time = $scope.ddlTime[j];
                    var counter = 0;
                     for (var i = 0; i < $scope.apptsForSelectedDate.length; i++) {

                         var tempAppt = $scope.apptsForSelectedDate[i];
                         if (time.split(' ')[0] == tempAppt.scheduledate.split(' ')[1]) {
                             counter++;
                         }
                   
                     }
                     var obj = {
                         "time": time,
                         "seats": $rootScope.seatsAvaliable - counter
                     }

                     $scope.timesAvaliable.push(obj);

                }

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
        
            $scope.seats = "5";

        
            $scope.ScheduleAppointment = function () {
                var createdDate = $rootScope.GetFormattedDate();

                var scheduledDate = $scope.dateSelected +" " + $scope.timeSelected;
                
              
                var note = $scope.note;
                if (note == undefined) {
                    note = "";
                }
                var userID = $rootScope.GetCookie("userID");
                var newAppt = {
                    "createdDate": createdDate,
                    "scheduledate": scheduledDate,
                    "note":note,
                    "userID":userID
                }

                $rootScope.pageModel.appointments.push(newAppt);
                $('.ui.schedule.modal').modal('hide all');

                PageModelFactory.PostPageModel().then(function (res) {
                    $rootScope.isLoading = false;
                    $rootScope.ShowToast("✔ Scheduled Appointment", "limegreen");
                    $scope.dateSelected = "";
                    $scope.timeSelected = "";
                    $scope.note = "";
                   
                });

            }

            $scope.GoToLogin = function () {
                $rootScope.LoadPage('<userlogin></userlogin>', '</userlogin>');
                $(".ui.schedule.modal").modal('hide');
            }


            $scope.disableSchedule = ($scope.timeSelected == undefined || $scope.timeSelected == "") ? true : false;
           
            $scope.$watch('timeSelected', function () {
                $scope.disableSchedule = ($scope.timeSelected == undefined || $scope.timeSelected == "") ? true : false;
              
            });

            $scope.SelectTimeSlot = function (timeAppt) {
                $scope.timeSelected = timeAppt.time;

            }



        }]

    }
});