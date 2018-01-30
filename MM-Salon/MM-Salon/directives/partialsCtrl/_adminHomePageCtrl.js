myApp.directive('adminhomepage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_adminHomePage.html',
        scope: {
        },
        controller: ["$scope", "$window", function ($scope, $window) {


            $scope.AllItems = [];
            $scope.FileNameToUpload = '';
            $scope.txtAboutUs = $rootScope.pageModel.homePage.aboutUsTxt;
            $scope.txtFBLink = $rootScope.pageModel.homePage.fbLink;
            $scope.txtTwitterLink = $rootScope.pageModel.homePage.twitterLink;
            $scope.txtInstaLink = $rootScope.pageModel.homePage.instaLink;
            $scope.txtEmail = $rootScope.pageModel.homePage.email;
            $scope.txtNumber = $rootScope.pageModel.homePage.number;
            $scope.txtAddress = $rootScope.pageModel.homePage.address;
            $scope.memeberImgSource = "";
            $scope.memeberImgSource2 = "";
            $scope.newMember = null;
            for (var i = 0; i < $rootScope.pageModel.homePage.specialties.length; i++) {
                var special = $rootScope.pageModel.homePage.specialties[i];
                if(special == "Nails"){
                    $scope.nailsAdded = true;
                }
                if(special == "Hair"){
                    $scope.hairAdded = true;
                }
                if(special == "Skin"){
                    $scope.skinAdded = true;
                }
                if(special == "Products"){
                    $scope.prodAdded = true;
                }
                
                
             }
            

            $(document).ready(function () {

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });

                $('.ui.accordion').accordion();

                $('.carousel').carousel('pause');

                $('.help').popup();

              
            });


            $scope.SaveAboutUsText = function(){
                $scope.txtAboutUs;

                $rootScope.pageModel.homePage.aboutUsTxt = $scope.txtAboutUs;
                $rootScope.SetPageModel();

            }


            $scope.AddSpecailty = function (special) {
                $rootScope.pageModel.homePage.specialties.push(special);
                $rootScope.SetPageModel();
            

                if (special == "Nails") {
                    $scope.nailsAdded = true;
                }
                if (special == "Hair") {
                    $scope.hairAdded = true;
                }
                if (special == "Skin") {
                    $scope.skinAdded = true;
                }
                if (special == "Products") {
                    $scope.prodAdded = true;
                }
            }

            $scope.RemoveSpecial = function (special) {
                for (var i = 0; i < $rootScope.pageModel.homePage.specialties.length; i++) {
                    var tempSpec = $rootScope.pageModel.homePage.specialties[i];
                    if (tempSpec == special) {
                        $rootScope.pageModel.homePage.specialties.splice(i, 1);
                        $rootScope.SetPageModel();
                    }
                }

                if (special == "Nails") {
                    $scope.nailsAdded = false;
                }
                if (special == "Hair") {
                    $scope.hairAdded = false;
                }
                if (special == "Skin") {
                    $scope.skinAdded = false;
                }
                if (special == "Products") {
                    $scope.prodAdded = false;
                }
            }






            $scope.dateTime = new Date().getTime();


            function UpdateWorkGallery() {
                var tempArr = [];
                $scope.AllItems = [];
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

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
            }

            UpdateWorkGallery();


            $scope.RemoveFromGallery = function (pic) {
                for (var i = 0; i < $rootScope.pageModel.homePage.workGallery.length; i++) {
                    var tempPics = $rootScope.pageModel.homePage.workGallery[i];
                    if (tempPics == pic) {
                        $rootScope.pageModel.homePage.workGallery.splice(i, 1);
                        $rootScope.SetPageModel();
                        UpdateWorkGallery();
                    }
                }
            }

            $scope.ShowDeleteMemberWarning = function (member) {
                $scope.memberToDelete = member;
                $scope.memberToDeleteName = member.name;
                $('.ui.remove.modal').modal('show');
            }
            $scope.EditMember = function (member) {
                $scope.memberToEdit = member;
                $scope.memberImg = member.imgURL;
                $scope.memberName = member.name;
                $scope.memeberAbout = member.about;
                $scope.memberFBLink = member.facebook;
                $scope.memberTwitterLink = member.twitter;
                $scope.memberInstaLink = member.instagram;
                $scope.FileNameToUpload = member.name.split(' ')[0];
                $('.ui.edit.modal').modal({ blurring: true }).modal('show');
            }
            $scope.AddMember = function () {
              

                if ($scope.memName != undefined && $scope.memAbout != undefined && $scope.memName != "" && $scope.memAbout != "" && $scope.memeberImgSource != "") {
                    var imgName = 'members/' + $scope.memName + '.jpg';
                    $scope.newMember = {
                        "name": $scope.memName,
                        "about": $scope.memAbout,
                        "imgURL": 'images/' + imgName,
                        "facebook": $scope.memFB,
                        "instagram": $scope.memInsta,
                        "twitter": $scope.memTwitter

                    };
                    var files = $("#memberUpload").get(0).files;

                    if (files[0] != undefined) {
                        var fu = "#memberUpload";
                        $scope.UploadImages(fu, imgName);                   
                  }

                }
                else {
                    $rootScope.ShowToast("Please complete form","darkred");
                }
            }
            
            $scope.RemoveMember = function (member) {
                for (var i = 0; i < $rootScope.pageModel.homePage.team.length; i++) {
                    var tempMem = $rootScope.pageModel.homePage.team[i];
                    if (tempMem == member) {
                        $rootScope.pageModel.homePage.team.splice(i, 1);
                        $rootScope.SetPageModel();
                    }
                }
            }

            $scope.SaveMemberEdit = function () {

                if ($scope.memeberAbout != "") {
                    if ($scope.memeberImgSource2 != "") {
                        var files = $("#memberUpload").get(0).files;

                        if (files[0] != undefined) {
                            var fu = "#memberUpload";


                            for (var i = 0; i < $rootScope.pageModel.homePage.team.length; i++) {
                                var member = $rootScope.pageModel.homePage.team[i];

                                if (member == $scope.memberToEdit) {

                                    var imgName = 'members/' + member.name + '.jpg';
                                    member.imgURL = "images/" + imgName;
                                    member.about = $scope.memeberAbout;
                                    member.facebook = $scope.memberFBLink;
                                    member.twitter = $scope.memberTwitterLink;
                                    member.instagram = $scope.memberInstaLink;
                                    $rootScope.pageModel.homePage.team[i] = member;
                                    
                                    $scope.UploadImages(fu, imgName);

                                }
                            }
                        }

                    }
                    else {
                        for (var i = 0; i < $rootScope.pageModel.homePage.team.length; i++) {
                            var member = $rootScope.pageModel.homePage.team[i];

                            if (member == $scope.memberToEdit) {


                                member.about = $scope.memeberAbout;
                                member.facebook = $scope.memberFBLink;
                                member.twitter = $scope.memberTwitterLink;
                                member.instagram = $scope.memberInstaLink;

                                $rootScope.pageModel.homePage.team[i] = member;
                                $rootScope.SetPageModel();

                            }
                        }
                    }


                }
                else {
                    $rootScope.ShowToast("About the member cannot be empty","darkred");
                }

            }



            $scope.TriggerFileUpload = function (val) {
                if (val == "memberUpload") {
                    $("#memberUpload").trigger("click");
                }
                else {
                    $scope.FileNameToUpload = val;
                    $("#imgUpload").trigger("click");
                }
            }

            $scope.setMemberFile = function (element) {
                $scope.currentFile = element.files[0];
                var reader = new FileReader();

                reader.onload = function (event) {
                    if ($(".ui.edit.modal").hasClass('active')) {
                        $scope.memeberImgSource2 = event.target.result;
                        $scope.$apply();
                    }
                    else {
                        $scope.memeberImgSource = event.target.result;
                        $scope.$apply();
                    }
                }
                // when the file is read it triggers the onload event above.
                reader.readAsDataURL(element.files[0]);
            }

            $scope.FileChanged = function () {
                var files = $("#imgUpload").get(0).files;
                $rootScope.isLoading = true;
                if (files[0] != undefined) {
                    var fu = "#imgUpload";
                    var name = $scope.FileNameToUpload + '.jpg';

                    if ($scope.FileNameToUpload == "gallery") {
                        $scope.dateTime = new Date().getTime();
                        $scope.FileNameToUpload = "workGallery/"+$scope.FileNameToUpload + $scope.dateTime+'.jpg';
                        $scope.UploadImages(fu, $scope.FileNameToUpload);

                        $rootScope.pageModel.homePage.workGallery.push("images/" + $scope.FileNameToUpload);
                      
                    }
                    else {
                        $scope.UploadImages(fu, name);
                    }
                   
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


                                if ($scope.newMember != null) {
                                    $rootScope.pageModel.homePage.team.push($scope.newMember);
                                    $scope.newMember = null;
                                }

                            $rootScope.SetPageModel().then(function () {


                                UpdateWorkGallery();
                                $rootScope.isLoading = false;

                                var eleID = $scope.FileNameToUpload.split('/')[$scope.FileNameToUpload.split('/').length - 1];
                                
                                var ele = $("#" + eleID).attr('src', $("#" + eleID).attr('src') + '?' + new Date().getTime());

                            });

                            $scope.$apply();


                            //var tempImg = $scope.FileNameToUpload.split('/')[1];
                            //$("#" + tempImg).attr('src', 'images/temp/' + $scope.FileNameToUpload + '.jpg');
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


            $scope.SaveContactInfo = function () {

                $rootScope.pageModel.homePage.fbLink = $scope.txtFBLink;
                $rootScope.pageModel.homePage.twitterLink = $scope.txtTwitterLink;
                $rootScope.pageModel.homePage.instaLink = $scope.txtInstaLink;
                $rootScope.pageModel.homePage.email = $scope.txtEmail;
                $rootScope.pageModel.homePage.number = $scope.txtNumber;
                $rootScope.pageModel.homePage.address = $scope.txtAddress;

                $rootScope.SetPageModel();


            }




           
        }]

    }
});