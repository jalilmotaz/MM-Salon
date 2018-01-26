var myApp = angular.module('myApp', ['ngMaterial', 'ngCookies']);

myApp.run(function ($rootScope, $http, $cookies, $compile, $location) {


    $rootScope.LoadPage = function (dir, key) {
        if (!$('#pageView').html().includes(key)) {
            $('#pageView').empty().append($compile(dir)($rootScope));

        }
    }

    var path = $location.path();
    switch (path) {

        case "/ScheduleAppointment":
            $rootScope.LoadPage('<dealerportal></dealerportal>', '</dealerportal>');
            break;

        case "/Landing":
        case "/About":
        case "/Contact":
        case "/Gallery":
        default:
            $rootScope.LoadPage('<landing></landing><about></about><contact></contact><gallery></gallery>', '</landing>');
            break;
    }




    $rootScope.tabSelected = 1;

    $rootScope.ShowToast = function (msg, color) {
        var x = document.getElementById("snackbar");
        x.style.visibility = "visible";
        x.innerHTML = "<div><p class='mdFont'>" + msg + "</p></div>";
        x.style.backgroundColor = color;
        x.className = "show";
        x.onclick = function () {
            console.log(document.getElementById("snackbar"));
            document.getElementById("snackbar").style.visibility = "hidden";
        };
        setTimeout(function () {
            x.className = x.className.replace("show", "");
            x.style.visibility = "hidden";
        }, 3000);
    }

    $rootScope.PutCookie = function(key, value) {
        $cookies.put(key, value);
    }
    $rootScope.GetCookie = function (key) {
        return $cookies.get(key);
    }



 
});