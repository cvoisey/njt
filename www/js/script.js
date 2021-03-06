var URL = "http://clevertest.ealert.com/getbusinfo.asmx?op=GetScheduledData";

angular.module('mainModule', ['ng.httpLoader'])
  .config(['httpMethodInterceptorProvider',
    function (httpMethodInterceptorProvider) {
    httpMethodInterceptorProvider.whitelistDomain('ealert.com');
    // ...
   }
  ]);

angular.module("mainModule", ['ionic'])
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

  .controller("mainController", function ($scope, $http, jsonFilter)
  {
    var logResult = function (str, data, status, headers, config)
    {
      var x2js = new X2JS();
      var json = x2js.xml_str2json( data );
      var result = x2js.xml_str2json(json.Envelope.Body.GetScheduledDataResponse.GetScheduledDataResult);      
      return result;
    };

    $scope.clearSearch = function () {
        $scope.stopParam1 = "";
    };

    $scope.doRefresh = function() {
        $scope.postCall($scope.stopParam1);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };

    $scope.postCall = function (stopParam1) {
        $scope.loading = true;
        $scope.stopParam1 = stopParam1;
      
        var ReqData = '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body> <GetScheduledData xmlns="http://ealert.com/"><StopID>' + stopParam1 +'</StopID></GetScheduledData></soap12:Body></soap12:Envelope>';
        $http({
              url:  URL,
              data: ReqData,
              method:  "POST",
              crossDomain: true,
              headers:  {
                  'Access-Control-Allow-Origin' : 'http://clevertest.ealert.com',
                  'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                  'Content-Type': 'text/xml'
              }
        })
        .success(function (data, status, headers, config)
        {
          $scope.postCallResult = logResult("POST SUCCESS", data, status, headers, config);
          $scope.loading = false;
        })
        .error(function (data, status, headers, config)
        {
          $scope.postCallResult = logResult("POST ERROR", data, status, headers, config);
          $scope.loading = false;
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
            log.console("Finished");
            $scope.loading = false;
        });
        
    };

  })
;
//$scope.loading=false;