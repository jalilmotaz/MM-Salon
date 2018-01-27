myApp.directive('adminhomepage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_adminHomePage.html',
        scope: {
        },
        controller: ["$scope","$window", function ($scope,$window) {

            $(document).ready(function(){
                $('.special.cards .image').dimmer({
                    on: 'hover'
                });

                $('.ui.accordion').accordion();

                $('.carousel').carousel('pause');
            });
               
            

        }]

    }
});