// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput'])

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            },
            'fabContent': {
                template: '<button id="fab-home" class="button button-fab button-fab-top-right expanded button-energized-900 flap"></i></button>',
                controller: function ($timeout) {
                   /* $timeout(function () {
                        document.getElementById('fab-home').classList.toggle('on');
                    }, 200); */
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

	.state('app.notifications', {
        url: '/notifications',
        views: {
            'menuContent': {
                templateUrl: 'templates/notifications.html',
                controller: 'NotificationsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-notifications" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

    .state('app.projects', {
        url: '/projects',
        views: {
            'menuContent': {
                templateUrl: 'templates/projects.html',
                controller: 'ProjectsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-projects" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                   /* $timeout(function () {
                        document.getElementById('fab-projects').classList.toggle('on');
                    }, 900); */
                }
            }
        }
    })

    .state('app.funds', {
        url: '/funds',
        views: {
            'menuContent': {
                templateUrl: 'templates/funds.html',
                controller: 'FundsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-funds" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-arrow-graph-up-right"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

	.state('app.personnel', {
        url: '/personnel',
        views: {
            'menuContent': {
                templateUrl: 'templates/personnel.html',
                controller: 'PersonnelCtrl'
            },
            'fabContent': {
                template: '<button id="fab-personnel" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-arrow-graph-up-right"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function()
					{
						$ionicNavBarDelegate.align('center');
					});*/
                }
            }
        }
    })

	.state('app.location', {
        url: '/location',
        views: {
            'menuContent': {
                templateUrl: 'templates/location.html',
                controller: 'LocationCtrl'
            },
            'fabContent': {
                template: '<button id="fab-location" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-arrow-graph-up-right"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

	.state('app.inventory', {
        url: '/inventory',
        views: {
            'menuContent': {
                templateUrl: 'templates/inventory.html',
                controller: 'InventoryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-inventory" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-arrow-graph-up-right"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
