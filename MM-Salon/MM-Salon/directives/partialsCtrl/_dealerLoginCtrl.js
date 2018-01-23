myApp.directive('dealerlogin', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_dealerLogin.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {

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