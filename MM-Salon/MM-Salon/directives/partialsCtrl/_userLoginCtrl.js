myApp.directive('userlogin', function ($rootScope, PageModelFactory) {
    return {
        templateUrl: 'directives/partials/_userLogin.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {
            $rootScope.isLoggedIn = false;
            $scope.rememeberMe = true;
            $rootScope.PutCookie("userID", undefined);


            $scope.LoginUser = function () {
                $rootScope.isLoading = true;

                if (!$scope.logEmail || $scope.logEmail == "" || !$scope.logPassword || $scope.logPassword == "") {
                    $rootScope.ShowToast("Please fill all the fields", "darkred");
                    return;
                }
                var url = "api/WebAPI/LoginUser/post";
                var data = $scope.logEmail + "|sep|"+ $scope.logPassword;
                PageModelFactory.Post(url, data).then(function (res) {
                    $rootScope.isLoading = false;
                    if (res != null) {
                        $rootScope.ShowToast("Login successfully", "limegreen");
                        if ($scope.rememeberMe) {
                            $rootScope.PutCookie("userID", res.userID);
                            $rootScope.PutCookie("user", JSON.stringify(res));
                            
                        }
                        $rootScope.myID = res.userID;

                        $rootScope.loggedInUser = JSON.parse($rootScope.GetCookie("user"));
                        
                        $rootScope.isLoggedIn = true;
                        $rootScope.LoadPage('<accountpage></accountpage>', '</accountpage>');
                    } else {
                        $rootScope.ShowToast("Sorry, email and password do not match", "darkred");
                    }
                });

            }


            $scope.RegisterUser = function () {

                if (!$scope.regName || $scope.regName == "" || !$scope.regEmail || $scope.regEmail == "" || !$scope.regPassword || $scope.regPassword == "" || !$scope.regPassword2 || $scope.regPassword2 == "" || !$scope.regNumber || $scope.regNumber == "") {
                    $rootScope.ShowToast("Please fill all the fields", "darkred");
                    return;
                } else if ($scope.regPassword != $scope.regPassword2) {
                    $rootScope.ShowToast("Passwords do not match, please try again", "darkred");
                    return;
                }
                $rootScope.isLoading = true;

                var url = "api/WebAPI/CreateUser/post";
                var data = new Date().getTime() + "|sep|" + $scope.regName + "|sep|" + $scope.regEmail + "|sep|" + $scope.regNumber + "|sep|" + $scope.regPassword;
                PageModelFactory.Post(url, data).then(function (res) {
                    $rootScope.isLoading = false;
                    if (res == "good") {
                        $rootScope.ShowToast("Registered successfully", "limegreen");
                        $('#login-form-link').trigger("click");
                        $scope.logEmail = $scope.regEmail;

                    } else if (res == "exists") {
                        $rootScope.ShowToast("Email already exists", "darkred");
                    } else {
                        $rootScope.ShowToast("Sorry, an error occured. Try again", "darkred");
                    }
                });


            }


            $scope.RecoverPassword = function () {
                var email = $scope.recPassEmail;
                if (email != "" && email != undefined) {
                    $rootScope.isLoading = true;

                    var url = "api/WebAPI/ForgotPassword/post";

                    PageModelFactory.Post(url, email).then(function (res) {
                        $rootScope.isLoading = false;
                        if (res == "good") {
                            $rootScope.ShowToast("Password sent to email", "limegreen");
                        } else if (res == "bad") {
                            $rootScope.ShowToast("Email not found", "darkred");
                        } else {
                            $rootScope.ShowToast("Sorry, an error occured. Try again", "darkred");
                        }
                    });

                }
                else {
                    $rootScope.ShowToast("Please fill all the fields", "darkred");
                }
            }








            $(function () {
                $('#login-form-link').click(function (e) {
                    $("#login-form").delay(100).fadeIn(100);
                    $("#register-form").fadeOut(100);
                    $("#forgot-form").fadeOut(100);
                    $('#register-form-link').removeClass('active');
                    $(this).addClass('active');
                    e.preventDefault();
                });
                $('#register-form-link').click(function (e) {
                    $("#register-form").delay(100).fadeIn(100);
                    $("#login-form").fadeOut(100);
                    $("#forgot-form").fadeOut(100);
                    $('#login-form-link').removeClass('active');
                    $(this).addClass('active');
                    e.preventDefault();
                });
                $('#forgotPassword').click(function (e) {
                    $("#forgot-form").delay(100).fadeIn(100);
                    $("#register-form").fadeOut(100);
                    $("#login-form").fadeOut(100);
                    $('#login-form-link').removeClass('active');
                    $(this).addClass('active');
                    e.preventDefault();
                });
            });

        }]

    }
});