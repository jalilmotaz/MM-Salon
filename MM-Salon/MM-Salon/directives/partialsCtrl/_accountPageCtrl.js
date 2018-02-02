myApp.directive('accountpage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_accountPage.html',
        scope: {
        },
        controller: ["$scope", "PageModelFactory", function ($scope, PageModelFactory) {
            var user;
            $scope.userAppointments = [];
            $(document).ready(function () {

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                $('.ui.accordion').accordion();
                
                user = JSON.parse($rootScope.GetCookie("user"));
                $scope.fullName = user.name;
                $scope.phoneNumber = user.number;

                for (var i = 0; i < $rootScope.pageModel.appointments.length; i++) {
                    var tempAppt = $rootScope.pageModel.appointments[i];
                    if (tempAppt.userID == user.userID) {
                        $scope.userAppointments.push(tempAppt);
                    }
                }
            
 
            });

          


            $scope.SaveEdit = function myfunction() {
                var changedPass = false;
                if ($scope.fullName == "" || $scope.phoneNumber == "") {
                    $rootScope.ShowToast("Please fill all feilds", "darkred");
                    return;
                }
                if ($scope.curPass == undefined || $scope.curPass == "") {
                    var data = user.userID + "|sep|" + $scope.fullName + "|sep|" + $scope.phoneNumber + "|sep|" + user.password;

                }
                else {
                    if ($scope.newPass != undefined && $scope.newPass != "" && $scope.confNewPass != undefined && $scope.confNewPass != "") {
                        if ($scope.curPass != user.password) {
                            $rootScope.ShowToast("Current password did not match", "darkred");
                            return;
                        }
                        else if ($scope.newPass != $scope.confNewPass) {
                            $rootScope.ShowToast("Confirmed password did not match", "darkred");
                            return;
                        }
                        else {
                            var data = user.userID + "|sep|" + $scope.fullName + "|sep|" + $scope.phoneNumber + "|sep|" + $scope.newPass;
                            changedPass = true;
                        }
                    }
                    else {
                        $rootScope.ShowToast("Please fill all feilds", "darkred");
                        return;
                    }
                }
                var url = "api/WebAPI/UpdateUser/post";

                PageModelFactory.Post(url, data).then(function(res) {
                    $rootScope.loggedInUser.name = $scope.fullName;
                    $rootScope.loggedInUser.number = $scope.phoneNumber;
                    if (changedPass) {
                        $rootScope.loggedInUser.password = $scope.newPass;
                    }
                    $rootScope.ShowToast("✔ Saved Succesfully", "limegreen");

                });

            }


                $scope.FileChanged = function () {
                    $rootScope.isLoading = true;

                    var files = $("#imgUpload").get(0).files;
                    if (files[0] != undefined) {
                        var fu = "#imgUpload";
                        var name = $rootScope.GetCookie("userID") + '.jpg';
                        $scope.UploadImages(fu, name);
                    }
                }





                $scope.UploadImages = function (fu, name) {

                    files = $(fu).get(0).files;

                    if (files[0] != undefined) {
                        var data = new FormData();


                        data.append("name", name);

                        data.append("UploadedImage", files[0]);

                  

                        var ajaxRequest = $.ajax({
                            type: "POST",
                            url: $rootScope.server + 'api/webapi/UploadImage/post',
                            contentType: false,
                            processData: false,
                            data: data
                        });



                        ajaxRequest.done(function (xhr, textStatus) {
                            if (xhr == "good") {
                                $rootScope.ShowToast("✔ Upload Success", "limegreen");
                                var eleID = "userPic"
                                 $("#" + eleID).attr('src', $("#" + eleID).attr('src') + '?' + new Date().getTime());
                                 $rootScope.isLoading = false;
                             }
                            else {
                                $rootScope.ShowToast("❌ Error Uploading", "darkred");
                                $rootScope.isLoading = false;

                            }
                        });

                    }
                    else {
                        $rootScope.ShowToast("No image selected", "darkred");
                        $rootScope.isLoading = false;
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