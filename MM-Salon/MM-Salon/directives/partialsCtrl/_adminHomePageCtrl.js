myApp.directive('adminhomepage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_adminHomePage.html',
        scope: {
        },
        controller: ["$scope", function ($scope) {

            $('.special.cards .image').dimmer({
                on: 'hover'
            });

            $('.ui.accordion').accordion();

            $('.carousel').carousel('pause');



        }]

    }
});