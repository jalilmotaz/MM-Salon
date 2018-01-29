myApp.directive('userlogin', function ($rootScope, PageModelFactory) {
    return {
        templateUrl: 'directives/partials/_userLogin.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {

            $scope.LoginUser = function() {
                if (!$scope.logEmail || $scope.logEmail == "" || !$scope.logPassword || $scope.logPassword == "") {
                    $rootScope.ShowToast("Please fill all the fields", "darkred");
                    return;
                }
                var url = "api/WebAPI/LoginUser/post";
                var data = $scope.logEmail + "|sep|"+ $scope.logPassword;
                PageModelFactory.Post(url, data).then(function (res) {
                    $rootScope.isLoading = false;
                    if (res != "bad") {
                        $rootScope.ShowToast("Login successfully", "limegreen");
                    } else {
                        $rootScope.ShowToast("Sorry, email and password do not match", "darkred");
                    }
                });

            }


            $scope.RegisterUser = function () {

                if (!$scope.regName || $scope.regName == "" || !$scope.regEmail || $scope.regEmail == "" || !$scope.regPassword || $scope.regPassword == "" || !$scope.regPassword2 || $scope.regPassword2 == "") {
                    $rootScope.ShowToast("Please fill all the fields", "darkred");
                    return;
                } else if ($scope.regPassword != $scope.regPassword2) {
                    $rootScope.ShowToast("Passwords do not match, please try again", "darkred");
                    return;
                }
                $rootScope.isLoading = true;

                var url = "api/WebAPI/CreateUser/post";
                var data = new Date().getTime() + "|sep|" + $scope.regName + "|sep|" + $scope.regEmail + "|sep||sep|" + $scope.regPassword;
                PageModelFactory.Post(url, data).then(function (res) {
                    $rootScope.isLoading = false;
                    if (res == "good") {
                        $rootScope.ShowToast("Registered successfully", "limegreen");
                    } else if (res == "exists") {
                        $rootScope.ShowToast("Email already exists", "darkred");
                    } else {
                        $rootScope.ShowToast("Sorry, an error occured. Try again", "darkred");
                    }
                });


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