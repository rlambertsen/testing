var theshit = angular.module('theshit', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'angular-spinkit', 'ngStorage', 'textAngular']);

// Declare app level module which depends on views, and components


theshit.config(function($locationProvider, $routeProvider) {
    $routeProvider
    .when('/home', {
        templateUrl: '/templates/home.html',
        controller: 'HomeCtrl'
    })

    .when('/about', {
        templateUrl: '/templates/about.html',
        controller: 'AboutCtrl'
    })

    .when('/pricing', {
        templateUrl: '/templates/pricing.html',
        controller: 'PriceCtrl'
    })

    .when('/blog', {
        templateUrl: '/templates/blog.html',
        controller: 'BlogCtrl'
    })

    .when('/single-post', {
        templateUrl: 'templates/blog-single.html',
        controller: 'SinglePostCtrl',
        resolve: {
            singlePost: function($readMore){
                return $readMore.getList();
            }
        }
    })

    .when('/contact', {
        templateUrl: '/templates/contact.html',
        controller: 'ContactCtrl'
    })

    .when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .when('/admin', {
        templateUrl: 'templates/admin.html',
        controller: 'AdminCtrl'
    })

    .otherwise('/home');
})

theshit.directive('routeLoadingIndicator', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: "<div ng-show='isRouteLoading' class='loading-indicator'>" +
        "<div class='loading-indicator-body'>" +
        "<div class='spinner'><rotating-plane-spinner></rotating-plane-spinner></div>" +
        "</div>" +
        "</div>",
        replace: true,
        link: function($scope, elem, attrs) {
            $scope.isRouteLoading = false;

            $rootScope.$on('$routeChangeStart', function() {
                $scope.isRouteLoading = true;
                
            });
            $rootScope.$on('$routeChangeSuccess', function() {
                $scope.isRouteLoading = false;
                
            });
        }
    };
})


theshit.filter('dateChange', function() {
    return function(input) {
        input = new Date(input).toDateString();
        return input;
    };
})

theshit.run(function ($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
     
   });
})

.factory('$readMore', function($localStorage) {

    $localStorage = $localStorage.$default({
        things: []
    });

    return {
        addItem: addItem,
        getList: getList,
        remove: remove
    }; 

    function addItem(item) {
        $localStorage.things.push(item);
    }

    function getList() {
        return $localStorage.things;
    }

    function remove(item) {
        $localStorage.things.splice($localStorage.things.indexOf(item), 1);
    }

})

theshit.controller('LoginCtrl',function ($scope, $http, $location, $window, $localStorage){
    $scope.user = {};

    var link = 'http://www.rylan-dev.site/login.php';
    $scope.login = function(){
        userEmail = $scope.user.email;
        userPassword = $scope.user.password;
        $http.post(link, {userEmail: userEmail, userPassword: userPassword}).then(function (response) {
            if (response.data){
                $localStorage.$default({
                    email: ''
                });
                $localStorage.email = response.data.userEmail;
                $location.url('/admin');
            }else{
                $window.alert("Wong stuff man");
            }
        })  
    }

    if($localStorage.email != ''){
        $location.url('/admin');
    }
    
})

theshit.controller('AdminCtrl',function ($scope, $http, $window, $location, $localStorage){
    
    $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append('file', files[0]);
        var link = 'http://www.rylan-dev.site/save-image.php';
        $http.post(link, fd, {withCredentials: true, headers: {'Content-Type': undefined }, transformRequest: angular.identity})
        .then(function(response){
            console.log(response.data);
            $scope.postImage = response.data;
            $scope.showMessage = true;
        })
    };
    $scope.postBlog = function(){
        var postTitle = $scope.postTitle;
        var postDesc = $scope.postDesc;
        var postCont = $scope.postCont;
        var postImage = $scope.postImage;
        var link = 'http://www.rylan-dev.site/save-blog.php';
        $http.post(link, {postTitle : postTitle, postDesc: postDesc, postCont: postCont, postImage: postImage}).then(function (response){
            console.log(response.data);
            $window.alert('It posted!');
        })
    }

    $scope.logOut = function(){
        $localStorage.$reset({
            email: ''
        });
        $location.url('/home');
    }
})

theshit.controller('HomeCtrl',function ($scope, $http, $timeout){
    new WOW().init(); //animations
    
})

theshit.controller('AboutCtrl',function ($scope, $http){
    $scope.message = 'hi about me';
    
})

theshit.controller('PriceCtrl',function ($scope, $http){
    
})

theshit.controller('BlogCtrl',function ($scope, $http, $readMore){

    $scope.blog = {};
    var link = 'http://www.rylan-dev.site/load-blog.php';
    $scope.$on('$viewContentLoaded', function(){
        $http.post(link).then(function (response){
            $scope.blog = response.data;
            console.log($scope.blog);
        })
    });

    $scope.readMore = function($index){
        $readMore.remove($scope.blog);
        $readMore.addItem($scope.blog[$index]);
        console.log($scope.blog[$index]);
    }
})

theshit.controller('SinglePostCtrl',function ($scope, $http, singlePost, $readMore, $timeout){
    $scope.blog = singlePost;

    var link = 'http://www.rylan-dev.site/load-blog.php';
    $http.post(link).then(function (response){
        $scope.recent = response.data;
    })

    $scope.readMore = function($index){
        $readMore.remove($scope.blog);
        $readMore.addItem($scope.recent[$index]);
        console.log($scope.recent[$index]);
    }
})

theshit.controller('ContactCtrl',function ($scope){
    $scope.message = 'hi about me';
})

theshit.controller('FootCtrl',function ($scope, $http){
    $scope.date = new Date();
    $scope.blog = {};
    var link = 'http://www.rylan-dev.site/load-blog.php';
    $http.post(link).then(function (response){
        $scope.blog = response.data;
    });
});
