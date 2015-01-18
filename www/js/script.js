var URL = "http://clevertest.ealert.com/getbusinfo.asmx?op=GetScheduledData";
"use strict";

angular.module('mainModule', ['ng.httpLoader'])
    .config(['httpMethodInterceptorProvider',
        function (httpMethodInterceptorProvider) {
            httpMethodInterceptorProvider.whitelistDomain('ealert.com');
        }
            ]);
//TestComment
angular.module("mainModule", ['ionic','ui.router'])

   .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('about', {
                url: "/about",
                templateUrl: "about.html"
            })
        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: "main.html",
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    })

    .config(function ($compileProvider){
      // Set the whitelist for certain URLs just to be safe
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })

    .directive('loading', function () {
        return {
            restrict: 'E',
            replace : true,
            template: '<div class="loading"><img src="./img/ajax-loader.gif" width="20" height="20" /></div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
        }
      }
    })


  .controller("mainController", function ($scope, $http, $window, jsonFilter, $ionicPopover) {


    $ionicPopover.fromTemplateUrl('menu.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.demo = 'ios';
    $scope.setPlatform = function (p) {
        document.body.classList.remove('platform-ios');
        document.body.classList.remove('platform-android');
        document.body.classList.add('platform-' + p);
        $scope.demo = p;
    }

    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
    });

    var logResult = function (str, data, status, headers, config) {
        var x2js = new X2JS();
        var json = x2js.xml_str2json(data);
        var result = x2js.xml_str2json(json.Envelope.Body.GetScheduledDataResponse.GetScheduledDataResult);
        return result;
    };

    $scope.clearSearch = function () {
        $scope.stopParam1 = "";
    };

    /*  Used for testing
    $scope.stops1 = [
        {code : "10070", name: "A"},
        {code : "10094", name: "B"},
        {code : "10092", name: "C"}
    ];
*/
    //    $scope.stops = JSON.parse($window.localstorage.getItem('stops'));
    $scope.stops = JSON.parse($window.localStorage.getItem('stops'));
    console.log('Starting Stops');
    console.log($scope.stops);
    $scope.currentlyStored = "nothing is stored yet!";
    $scope.updatePreviousStops = function () {
        $window.localStorage['stops'] = JSON.stringify($scope.stops);
        $scope.currentlyStored = $window.localStorage['stops'];
        console.log($scope.currentlyStored);
    };

    $scope.getPreviousStops = function () {
        /*
        $scope.stops = JSON.parse($window.localstorage['stops']);
        $scope.currentlyStored = $window.localStorage['stops'];
    */
    };

    $scope.getPrevious = function () {
        console.log($scope.selectedStop.code);
        $scope.clearSearch();
        $scope.postCall($scope.selectedStop.code);
    };

    $scope.addToHistory = function () {
        console.log('Adding to History');
        if ($scope.stops != undefined) {
            if ($scope.stops[$scope.stops.length - 1].code != $scope.mystop[0].code) {
                $scope.stops = $scope.stops.concat($scope.mystop);
            }
        } else {
            $scope.stops = $scope.mystop;
        };
        if ($scope.stops.length > 5) {
            console.log('Too Many!');
            $scope.stops.shift();
        }
        $scope.updatePreviousStops();
    };


    $scope.doRefresh = function () {
        $scope.postCall($scope.stopParam1);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

    $scope.postCall = function (stopParam1) {
        $scope.loading = true;
        $scope.stopParam1 = stopParam1;
        var ReqData = '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body> <GetScheduledData xmlns="http://ealert.com/"><StopID>' + stopParam1 + '</StopID></GetScheduledData></soap12:Body></soap12:Envelope>';
        $http({
            url: URL,
            data: ReqData,
            method: "POST",
            crossDomain: true,
            headers: {
                'Access-Control-Allow-Origin': 'http://clevertest.ealert.com',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
                'Content-Type': 'text/xml'
            }
        })
            .success(function (data, status, headers, config) {
                $scope.postCallResult = logResult("POST SUCCESS", data, status, headers, config);
                if ($scope.postCallResult.BusStopInfo.StopSchedule.ArrivalTime != 'Invalid Input') {
                    $scope.mystop = [
                        {
                            code: $scope.postCallResult.BusStopInfo.StopID,
                            name: $scope.postCallResult.BusStopInfo.StopID + ' - ' + $scope.postCallResult.BusStopInfo.StopName
                        }
                    ];
                    $scope.addToHistory($scope.mystop);
                }
                //$scope.stops = $scope.stops.concat{stop};
                //$scope.updatePreviousStops();
                $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
                $scope.postCallResult = logResult("POST ERROR", data, status, headers, config);
                console.log($scope.postCallResult);
                console.log("Post Error");
                $scope.loading = false;
            })
            .finally(function () {
                $scope.$broadcast('scroll.refreshComplete')
                console.log("finished");
                $scope.loading = false;
            });

    };

});
//$scope.loading=false;
