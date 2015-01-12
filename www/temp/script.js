// Code goes here

angular.module('myApp', [])
  .directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="/img/ajax-loader.gif" width="20" height="20" />LOADING...</div>',
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
  .controller('myController', function($scope, $http) {
      $scope.cars = [];
      
      $scope.clickMe = function() {
        $scope.loading = true;
        $http.get('test.json')
          .success(function(data) {
            $scope.cars = data[0].cars;
            $scope.loading = false;
        });
      }
      
  });

