myApp.directive('apptmanager', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_apptmanager.html',
        scope: {
        },
        controller: ["$scope","PageModelFactory" ,function ($scope, PageModelFactory,$watch) {
            $scope.pastDate = false;
            $scope.dateToView = formatDate(new Date());

            $(document).ready(function () {
                $('.ui.dropdown').dropdown();
                $('.help').popup();
                $(".ui.schedule.modal").modal({detachable: false  },{ onDeny: function () { $('.ui.schedule.modal').modal('hide'); } }, { blurring: true });
                $scope.numSeats = $rootScope.pageModel.seats;
               
            });

            //These variables MUST be set as a minimum for the calendar to work
            $scope.calendarView = 'month';
            $scope.viewDate = new Date();


            $scope.MarkAsClosedDay = function () {
                if ($scope.closedDay) {
                    for (var i = 0; i < $rootScope.holidays.length; i++) {
                        if ($rootScope.holidays[i] == $scope.dateToView) {
                            $rootScope.holidays.splice(i, 1);
                            $rootScope.isLoading = true;
                            $rootScope.SetPageModel().then(function () {
                                $rootScope.ShowToast("✔ Marked as open", "limegreen");
                                $scope.closedDay = false;
                                $rootScope.isLoading = false;

                            });

                        }
                    }
                }
                else {
                    $rootScope.holidays.push($scope.dateToView);
                    $rootScope.isLoading = true;

                    $rootScope.SetPageModel().then(function () {
                        $rootScope.ShowToast("✔ Marked as closed", "limegreen");
                        $scope.closedDay = true;
                        $rootScope.isLoading = false;

                    });

                }


            }

            function ConvertTimeformat(format, myTime) {
                var time = myTime;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "pm" && hours < 12) hours = hours + 12;
                if (AMPM == "am" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                return sHours + ":" + sMinutes;
            }

            $scope.AddAppointment = function () {
                $scope.timeSelected = "";
                $scope.ddlTime = [];
                $(".ui.schedule.modal").modal("show");

                var getDayNum = new Date($scope.dateToView).getDay() - 1;
                var getDay = {};
                if (getDayNum < 0) {
                    var getDay = $rootScope.pageModel.homePage.hours[6];
                    
                } else {
                    var getDay = $rootScope.pageModel.homePage.hours[getDayNum];
                }

                
                    var openTime = ConvertTimeformat("24", getDay.open);
                    var closeTime = ConvertTimeformat("24", getDay.close);

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
                
                $scope.apptsForSelectedDate = [];
                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var temp = $rootScope.pageModel.appointments[i];

                    if (temp.scheduledate.split(' ')[0] == $scope.dateToView) {
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
                        "seats": $rootScope.pageModel.seats - counter
                    }

                    $scope.timesAvaliable.push(obj);

                }

            }
            $scope.timespanClicked = function (date) {
                $scope.dateToView = formatDate(date);
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                GetDateAppts();
          
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
        

        
            $scope.ScheduleAppointment = function () {
                var createdDate = $rootScope.GetFormattedDate();

                var scheduledDate = $scope.dateToView +" " + $scope.timeSelected;
                
              
                var note = $scope.note;
                if (note == undefined) {
                    note = "";
                }
                var newAppt = {
                    "apptID": new Date().getTime(),
                    "createdDate": createdDate,
                    "scheduledate": scheduledDate,
                    "note": note,
                    "userID": "0",
                }
               
                setTimeout(function () {
                    $rootScope.pageModel.appointments.push(newAppt);
                    $('.ui.schedule.modal').modal('hide all');

                    PageModelFactory.PostPageModel().then(function (res) {
                        $rootScope.isLoading = false;
                        $rootScope.ShowToast("✔ Scheduled Appointment", "limegreen");
                        $scope.timeSelected = "";
                        $scope.note = "";
                        GetDateAppts();

                    });

                },200);
                   
                   
                

              

            }

          

            $scope.disableSchedule = ($scope.timeSelected == undefined || $scope.timeSelected == "") ? true : false;
           
            $scope.$watch('timeSelected', function () {
                $scope.disableSchedule = ($scope.timeSelected == undefined || $scope.timeSelected == "") ? true : false;
              
            });

            $scope.SelectTimeSlot = function (timeAppt) {
                $scope.timeSelected = timeAppt.time;

            }


            var allUsers = [];
            PageModelFactory.GetUsers().then(function (res) {
                allUsers = res;
                GetDateAppts();
               
            });

            $scope.todayAppointments = [];

            function GetDateAppts() {
                $scope.closedDay = false;
                $scope.pastDate = false;
                $scope.todayAppointments = [];

                var getDayNum = new Date($scope.dateToView).getDay() - 1;
                var getDay = {};
                if (getDayNum < 0) {
                    var getDay = $rootScope.pageModel.homePage.hours[6];
                    
                } else {
                    var getDay = $rootScope.pageModel.homePage.hours[getDayNum];
                }
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                $scope.dayOfWeek = days[new Date($scope.dateToView).getDay()];

                if (getDay.open == "closed") {
                    $scope.closedDay = true;
                    return;
                }
                for (var i = 0; i < $rootScope.holidays.length; i++) {
                    if ($rootScope.holidays[i] == $scope.dateToView) {
                        $scope.closedDay = true;
                        return;
                    }
                }

                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var tempAppt = $rootScope.pageModel.appointments[i];
                   
                    if (tempAppt.scheduledate.split(' ')[0] == $scope.dateToView) {

                        if (tempAppt.userID == "0") {
                            var apptToPush = {
                                "apptID": tempAppt.apptID,
                                "time": tempAppt.scheduledate,
                                "note": tempAppt.note,
                                "custName": "Added by provider",
                                "custNum": "Added by provider",
                                "custEmail": "Added by provider"
                            }
                            $scope.todayAppointments.push(apptToPush);

                        }
                        else {

                            for (var j = 0; j < allUsers.length; j++) {
                                var tempUser = allUsers[j];
                                if (tempUser.userID == tempAppt.userID) {
                                    var apptToPush = {
                                        "apptID": tempAppt.apptID,
                                        "time": tempAppt.scheduledate,
                                        "note": tempAppt.note,
                                        "custName": tempUser.name,
                                        "custNum": tempUser.number,
                                        "custEmail": tempUser.email
                                    }

                                    $scope.todayAppointments.push(apptToPush);
                                }

                            }
                        }
                    }
                }
             
                var selectedDate = new Date($scope.dateToView);
                var now = new Date();

                now.setHours(0, 0, 0, 0);

                if (selectedDate < now) {
                    $scope.pastDate = true;
                }

                $scope.todayAppointments.sort(function (a, b) {
                    a = new Date(a.time);
                    b = new Date(b.time);

                    return a - b;
                });

             

            }
         

            $scope.CancelApptModal = function (appt) {
                $scope.ApptSelected = appt;
                $('.ui.cancelAppt.modal').modal({ detachable: false }, { onDeny: function () { $('.ui.cancelAppt.modal').modal('hide all'); } }, { blurring: true }).modal('show');
                $scope.appttime = appt.time;
            }

            $scope.CancelAppt = function () {
                
                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var tempAppt = $rootScope.pageModel.appointments[i];
                    if (tempAppt.apptID == $scope.ApptSelected.apptID) {
                        $rootScope.pageModel.appointments.splice(i, 1);
                        $rootScope.isLoading = true;
                        $rootScope.SetPageModel().then(function () {
                            $rootScope.isLoading = false;
                        });
                        GetDateAppts();
                        $('.ui.cancelAppt.modal').modal('hide all');
                        break;
                    }
                }
            }

            $scope.ContactCust = function (email) {
                $scope.custEmailToContact = email;
                $('.ui.contactCust.modal').modal({ detachable: false }, { onDeny: function () { $('.ui.contactCust.modal').modal('hide all'); } }, { blurring: true }).modal('show');

            }

            $scope.SendMessage = function () {
                var email = $scope.custEmailToContact;

                var sub = $scope.msgSub;
                var body = $scope.msgBody;
                if (sub != undefined && sub != "" && body != undefined && body != "") {
                    var url = "http://musicmaestromoe.azurewebsites.net/api/MailerAPI/sendEmail";
                    var data = "2|sep|" + email + "|sep|mmwtinfo@gmail.com|sep|MM Salon|sep|" + sub + "|sep|" + body;


                    $.post(url, data, function (res) {
                        if (res == "good") {
                            $rootScope.ShowToast("✔ Message sent", "limegreen");

                        }
                        else {
                            $rootScope.ShowToast("Error sending message", "darkred");

                        }
                        $('.ui.contactCust.modal').modal('hide all');

                    });
                }
                else
                {
                    $rootScope.ShowToast("Please fill form", "darkred");
                }
            }


            $scope.SaveNumberSeats = function () {
                if ($scope.numSeats != undefined && $scope.numSeats != "") {
                    $rootScope.pageModel.seats = $scope.numSeats;
                    $rootScope.isLoading = true;
                    $rootScope.SetPageModel().then(function () {
                        $rootScope.isLoading = false;
                    });

                }
            }
            $scope.SeatsIsNum = function () {
                if (isNaN($scope.numSeats)) {
                    $scope.numSeats = "";
                }
            }
        }]

    }
});