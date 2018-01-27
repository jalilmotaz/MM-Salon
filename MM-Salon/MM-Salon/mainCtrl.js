var myApp = angular.module('myApp', ['ngMaterial', 'ngCookies']);

myApp.run(function ($rootScope, $http, $cookies, $compile, $location, PageModelFactory) {

    $rootScope.server = "http://localhost:56014/";   //dev

    $rootScope.pageModel = {};

    //Setting the page model in rootscope
    PageModelFactory.GetPageModel().then(function (value) {
        $rootScope.pageModel = value;
        console.log(value);
        console.log($rootScope.pageModel);

    });


    $rootScope.SetPageModel = function () {
        return PageModelFactory.PostPageModel().then(function (value) {
            $rootScope.ShowToast("Saved Successfully", 'limegreen');
            return value;

        }).catch(function () {
            $rootScope.ShowToast("Error Saving", 'darkred');
            return value;
        });
    }


    $rootScope.LoadPage = function (dir, key) {

        if ($('#pageView').html() != undefined) {
            if (!$('#pageView').html().includes(key)) {
                $('#pageView').empty().append($compile(dir)($rootScope));

            }
        }
        else {
            $('#adminBody').empty().append($compile('<adminhomepage></adminhomepage>')($rootScope));

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



//factory to get page model
myApp.factory('PageModelFactory', function ($http, $rootScope) {
    this.GetPageModel = function () {
        return $http.get($rootScope.server + 'PageModel.json')
             .then(function (response) {
                 console.log(response);
                 return response.data;
             });
    };

    this.PostPageModel = function () {
        return $http.post($rootScope.server + "api/WebApi/SetPageModel", $rootScope.pageModel)
        .then(function (response) {
            return response.data;
        }).catch(function (res) {
            return res.data;
        });

    };
    return this;
});
