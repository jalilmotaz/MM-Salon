myApp.directive('adminhomepage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_adminHomePage.html',
        scope: {
        },
        controller: ["$scope","$window", function ($scope,$window) {


            $scope.AllItems = [];
            $scope.FileNameToUpload = '';

            $(document).ready(function () {

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });

                $('.ui.accordion').accordion();

                $('.carousel').carousel('pause');


                

            });
            $scope.dateTime = new Date().getTime();

            var tempArr = [];

            for (var i = 0; i < $rootScope.pageModel.homePage.workGallery.length; i++) {
                var url = $rootScope.pageModel.homePage.workGallery[i];
                tempArr.push(url);
                if ((i + 2) % 4 == 0) {
                    $scope.AllItems.push(tempArr);
                    tempArr = [];
                }

            }

            if (tempArr.length != 0) {
                $scope.AllItems.push(tempArr);
            }

            $scope.EditMember = function (member) {
                $scope.memberImg = member.imgURL;
                $scope.memberName = member.name;
                $scope.memeberAbout = member.about
                $('.ui.modal').modal({ blurring: true }).modal('show');
            }



            $scope.TriggerFileUpload = function (val) {
                $scope.FileNameToUpload = val;
                $("#imgUpload").trigger("click");
            }

            $scope.FileChanged = function () {
                var files = $("#imgUpload").get(0).files;

                if (files[0] != undefined) {
                    var fu = "#imgUpload";
                    var name = $scope.FileNameToUpload + '.jpg';

                    $scope.$apply($scope.UploadImages(fu, name));

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
                        url: $rootScope.server + 'api/webapi/UploadImage',
                        contentType: false,
                        processData: false,
                        data: data
                    });

                    ajaxRequest.done(function (xhr, textStatus) {
                        if (xhr == "good") {

                            $rootScope.ShowToast("✔ Upload Success", "limegreen");
                       
                            //var tempImg = $scope.FileNameToUpload.split('/')[1];
                            //$("#" + tempImg).attr('src', 'images/temp/' + $scope.FileNameToUpload + '.jpg');
                        }
                        else {
                            alert("Error Uploading");
                            $rootScope.ShowToast("❌ Error Uploading", "darkred");

                        }
                    });

                    
                }
                else {
                    $rootScope.ShowToast("No image selected", "darkred");
                }
            }

        }]

    }
});