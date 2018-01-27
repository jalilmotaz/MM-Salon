myApp.directive('navbar', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_navbar.html',
        scope: {
        },
        controller: ["$scope", "$window", function ($scope, $window) {
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