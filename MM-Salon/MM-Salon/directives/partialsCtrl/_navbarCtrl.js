myApp.directive('navbar', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_navbar.html',
        scope: {
        },
        controller: ["$scope", "$window", function ($scope, $window) {

            $scope.AccountTabClick = function () {
                if ($rootScope.GetCookie("userID") == undefined) {
                    $rootScope.LoadPage('<userlogin></userlogin>', '</userlogin>')
                }
                else {

                    $rootScope.LoadPage('<accountpage></accountpage>', '</accountpage>')
                }
            }


            $('a[href^="#"]').click(function () {
                var target = $(this.hash);
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 900);
                }
            });
 
        }]

    }
});