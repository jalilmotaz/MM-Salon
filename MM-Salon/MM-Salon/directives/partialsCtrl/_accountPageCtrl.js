myApp.directive('accountpage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_accountPage.html',
        scope: {
        },
        controller: ["$scope", "PageModelFactory", function ($scope, PageModelFactory) {
        
            var user;
            $(document).ready(function () {

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
                user = JSON.parse($rootScope.GetCookie("user"));
                console.log(user);
                $scope.fullName = user.name;
                $scope.phoneNumber = user.number;
                $scope.password = "************";


            });

            $scope.SaveEdit = function myfunction() {
                if (!$scope.fullName || $scope.fullName == "" || !$scope.phoneNumber || $scope.phoneNumber == "" || !$scope.password || $scope.password == "" || $scope.password.indexOf('*') != -1) {
                    $rootScope.ShowToast("Please fill all feilds", "darkred");
                    return;
                }

                user.name = $scope.fullName;
                user.number = $scope.phoneNumber;
                user.password = $scope.password;

                var url = "api/WebAPI/UpdateUser/post";
                var data = user;//make this id sep user name, sep phone sep password

                PageModelFactory.Post(url, data).then(function(res) {
                    alert("done");
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

        }]

    }
});