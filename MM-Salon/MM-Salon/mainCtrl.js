var myApp = angular.module('myApp', ['ngMaterial', 'ngCookies', 'ngSanitize', 'ngTouch', 'mwl.calendar', 'ui.bootstrap', 'ngAnimate']);

myApp.run(function ($rootScope, $http, $cookies, $compile, $location, $timeout, PageModelFactory) {
    $rootScope.isLoading = true;
    $rootScope.isLoggedIn = false;
    $rootScope.myID = "";
    $rootScope.holidays = [];
    $rootScope.StoreHours = [];
    $rootScope.daysOfWeek = ["Thur", "Mon", "Fri", "Tue", "Sat", "Wed", "Sun"];

   $rootScope.server = "http://localhost:56014/";   //dev
    // $rootScope.server = "http://mmwirelesstechdemo1.azurewebsites.net/";   //test

    $rootScope.pageModel = {};
    $rootScope.loggedInUser = {};
    //Setting the page model in rootscope
    PageModelFactory.GetPageModel().then(function (value) {
        $rootScope.pageModel = value;
        $rootScope.pageModel.homePage.aboutUsTxt = $rootScope.pageModel.homePage.aboutUsTxt.replace(/\n/g, '<br/>');
        $rootScope.holidays = $rootScope.pageModel.holidays;
        console.log(value);


        var path = $location.path().toUpperCase();
        switch (path) {

            case "/HomePageManager":
                $rootScope.LoadPage('<adminhomepage></adminhomepage>', '</adminhomepage>');
                break;
            case "/AppointmentManager":
                $rootScope.LoadPage('<apptmanager></apptmanager>', '</apptmanager>');
                break;
            case "/ACCOUNTPAGE":
                $rootScope.LoadPage('<scheduler></scheduler>', '</scheduler>');
                break;
            case "/MYAPPOINTMENTS":
                $rootScope.LoadPage('<userappointments></userappointments>', '</userappointments>');
                break;
            case "/SCHEDULEAPPOINTMENT":
                $rootScope.LoadPage('<scheduler></scheduler>', '</scheduler>');
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
                $rootScope.ShowToast("✔ Saved Successfully", 'limegreen');
            } else {
                $rootScope.ShowToast("❌ Error Saving", 'darkred');
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
            if (!$('#adminBody').html().includes(key)) {

                $('#adminBody').empty().append($compile(dir)($rootScope));
            }
        }
        $timeout(function () {
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

    $rootScope.PutCookie = function (key, value) {
        $cookies.put(key, value, {
            expires: new Date("01/01/2040")
        });
    }
    $rootScope.GetCookie = function (key) {
        return $cookies.get(key);
    }


    if ($rootScope.GetCookie("userID") && $rootScope.GetCookie("userID") != "") {
        $rootScope.isLoggedIn = true;
        $rootScope.myID = $rootScope.GetCookie("userID");
    }
    if ($rootScope.GetCookie("user") && $rootScope.GetCookie("user") != "") {
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
    function AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    $rootScope.GetFormattedDate = function () {
        var now = new Date();
        var hours = now.getHours();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return [[
            AddZero(now.getMonth() + 1),
            AddZero(now.getDate()),
            now.getFullYear()].join("/"),
            [AddZero(hours),
            AddZero(now.getMinutes())].join(":"),
            now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    }


    $rootScope.GoToLogin = function () {
        $rootScope.LoadPage('<userlogin></userlogin>', '</userlogin>');
        $(".ui.submitRev.modal").modal('hide all');
    }

    $rootScope.SubmitReview = function (txtRev) {
        if (txtRev != undefined && txtRev != "") {
            var rating = $('.ui.submitRating').rating('get rating');
            var name = $rootScope.loggedInUser.name;
            var date = $rootScope.GetFormattedDate();
            var ratingID = new Date().getTime();
            var userID = $rootScope.loggedInUser.userID;
            var newRev = {
                "reviewID": ratingID,
                "name": name,
                "date": date,
                "review": txtRev,
                "rating": rating,
                "userID": userID,

            };
            $('.submitRev.modal').modal('hide all');
            $rootScope.pageModel.reviews.push(newRev);
            $rootScope.isLoading = true;
            $rootScope.SetPageModel().then(function () {
                $rootScope.isLoading = false;
            })
        }
        else {
            $rootScope.ShowToast("Please fill out form", "darkred");
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
            .then(function (response) {
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
            console.log(response);
            if (response.status == 200) {
                return response.data;
            }
            else {
                return null;
            }
        }).catch(function (res) {
            return res.data;
        });
    };
    return this;
});
