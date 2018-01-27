myApp.directive('adminhomepage', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_adminHomePage.html',
        scope: {
        },
        controller: ["$scope","$window", function ($scope,$window) {


            $(document).ready(function () {

                $('.special.cards .image').dimmer({
                    on: 'hover'
                });

                $('.ui.accordion').accordion();

                $('.carousel').carousel('pause');


                

            });
               
            

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

            console.log($scope.AllItems);
            $scope.EditMember = function (member) {
                $scope.memberImg = member.imgURL;
                $scope.memberName = member.name;
                $scope.memeberAbout = member.about
                $('.ui.modal').modal({ blurring: true }).modal('show');
            }


        }]

    }
});