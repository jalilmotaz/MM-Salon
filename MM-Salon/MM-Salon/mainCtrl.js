var myApp = angular.module('myApp', ['ngMaterial', 'ngCookies', 'ngSanitize','ngTouch']);

myApp.run(function ($rootScope, $http, $cookies, $compile, $location,$timeout, PageModelFactory) {
    $rootScope.isLoading = true;
    $rootScope.isLoggedIn = false;

    $rootScope.server = "http://localhost:56014/";   //dev
   //$rootScope.server = "http://mjalilproj.azurewebsites.net/";   //test

    $rootScope.pageModel = {};
    $rootScope.loggedInUser = {};
    //Setting the page model in rootscope
    PageModelFactory.GetPageModel().then(function (value) {
        $rootScope.pageModel = value;
        $rootScope.pageModel.homePage.aboutUsTxt = $rootScope.pageModel.homePage.aboutUsTxt.replace(/\n/g, '<br/>');
        console.log(value);
 
        var path = $location.path().toUpperCase();
        switch (path) {

            case "/SCHEDULEAPPOINTMENT":
                $rootScope.LoadPage('<dealerportal></dealerportal>', '</dealerportal>');
                break;
            case "/LOGIN":
                $rootScope.LoadPage('<userlogin></userlogin>', '</userlogin>');
                break;
            case "/LANDING":
            case "/ABOUT":
            case "/CONTACT":
            case "/GALLERY":
            default:
                $rootScope.LoadPage('<landing></landing><about></about><contact></contact><gallery></gallery>', '</landing>');
                break;
        }



    });


    $rootScope.SetPageModel = function () {
        return PageModelFactory.PostPageModel().then(function (value) {
            if (value == "good") {
                $rootScope.ShowToast("Saved Successfully", 'limegreen');
            } else {
                $rootScope.ShowToast("Error Saving", 'darkred');
            }

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
        $timeout(function() {
            $rootScope.isLoading = false;
        }, 2000);
     }


    $rootScope.ShowToast = function (msg, color) {
        var x = document.getElementById("snackbar");
        x.style.visibility = "visible";
        x.innerHTML = "<div><p class='mdFont'>" + msg + "</p></div>";
        x.style.backgroundColor = color;
        x.className = "show";
        x.onclick = function () {
             document.getElementById("snackbar").style.visibility = "hidden";
        };
        setTimeout(function () {
            x.className = x.className.replace("show", "");
            x.style.visibility = "hidden";
        }, 3000);
    }

    $rootScope.PutCookie = function(key, value) {
        $cookies.put(key, value, {
            expires: new Date("01/01/2040")
        });
    }
    $rootScope.GetCookie = function (key) {
         return $cookies.get(key);
    }
 

    if ($rootScope.GetCookie("userID") && $rootScope.GetCookie("userID") != "") {
         $rootScope.isLoggedIn = true;
    }
    if ($rootScope.GetCookie("user") && $rootScope.GetCookie("user") !="") {
            $rootScope.loggedInUser = JSON.parse($rootScope.GetCookie("user"));
    }
    
    $rootScope.GetWordNumber = function (num) {
        switch (num) {
            case 1:
                return "one";
                break;
            case 2:
                return "two";
                break;
            case 3:
                return "three";
                break;
            case 4:
                return "four";
                break;
            case 5:
                return "five";
                break;
            case 6:
                return "six";
                break;
            case 7:
                return "seven";
                break;
            case 8:
                return "eight";
                break;
            case 9:
                return "nine";
                break;
              
        }
    }
});



//factory to get page model
myApp.factory('PageModelFactory', function ($http, $rootScope) {
    this.GetPageModel = function () {
        return $http.get($rootScope.server + 'PageModel.json')
             .then(function (response) {
                  return response.data;
             });
    };
    this.GetUsers = function () {
        return $http.get($rootScope.server + 'Users.json')
            .then(function(response){
            return response.data;
            });
    };

    this.PostPageModel = function () {
        return $http.post($rootScope.server + "api/WebApi/SetPageModel/post", $rootScope.pageModel)
        .then(function (response) {
            return response.data;
        }).catch(function (res) {
            return res.data;
        });
    };

    this.Post = function (url, data) {
        return $http.post($rootScope.server + url, data)
        .then(function (response) {
            return response.data;
        }).catch(function (res) {
            return res.data;
        });
    };
    return this;
});
