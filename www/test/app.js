angular.module('ionicApp', ['ionic','ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('signin', {
        url: "/sign-in",
        templateUrl: "sign-in.html",    })
    .state('forgotpassword', {
        url: "/forgot-password",
        template: "<a>Testing</a><h1>This Is A State</h1>"    });


   $urlRouterProvider.otherwise("/sign-in");

})


