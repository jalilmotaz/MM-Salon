myApp.directive('contact', function ($rootScope) {
    return {
        templateUrl: 'directives/partials/_contact.html',
        scope: {
        },
        controller:["$scope",function($scope){
            $scope.email = "";

            $scope.SendMessage = function () {
              
                var email = $scope.email,
                    msg = $scope.msg;
               
                var data = "2|sep|ManaratAlharam@gmail.com|sep|" + email + "|sep|" + email + "|sep|Message from Customer|sep|" + msg;
              
                var url = 'http://musicmaestromoe.azurewebsites.net/api/MailerAPI/sendEmail';

                $.post(url, data, function (res) {
                    if (res == "good") {
                        $rootScope.ShowToast("✔Thank you for your message!", "limegreen");
                    }
                    else {
                        $rootScope.ShowToast("Error sending message", "darkred");

                    }
                });
            }
        }]

    }
});