// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'firebase'])

app.run(function($ionicPlatform) {
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

app.factory("dbURL", [function()
{
	var dbURL = "https://pronirvahanadb.firebaseio.com/";
	return dbURL;
}]);

app.factory("Auth", ["dbURL", "$firebaseAuth",
  function(dbURL, $firebaseAuth) {
    var ref = new Firebase(dbURL);
    return $firebaseAuth(ref);
  }
]);

app.factory("UserDataService", ['$rootScope', 'dbURL', function($rootScope, dbURL){
	var userName = "undefined";
	var userOrg = "undefined";
	var userMail = "undefined";
	
	var factory = {};
	
	factory.getUserName = function(){
	console.log(userName + ":" + userOrg + ":" + userMail);
					return userName;
	}
	
	factory.getUserOrg = function(){
	console.log(userName + ":" + userOrg + ":" + userMail);
					return userOrg;
	}
	
	factory.getUserMail = function(){
	console.log(userName + ":" + userOrg + ":" + userMail);
					return userMail;
	}
	
	factory.setUserData = function(){
		dbRef = new Firebase(dbURL);
		authData = dbRef.getAuth();
		var childRef = dbRef.child('users/' + authData.uid);
	
		console.log("The DB path to the current user: " + childRef.toString());
		
		childRef.once("value", function(snapshot)
		{
			if(snapshot.exists())
			{
				console.log("Retrieved the details of the user: " + authData.uid);
				var data = snapshot.val();
				userName = data.userName;
				console.log("The user name is : " + userName);
				userOrg = data.userOrgCode;
				console.log("The user org is : " + userOrg);
				userMail = data.userMail;
				console.log("The user mail is : " + userMail);
				$rootScope.$broadcast('userDataDone');
			}
		});
	}
	
	return factory;
}]);

app.factory("LoginService", ['$location', '$timeout', '$rootScope', 'dbURL', function($location, $timeout, $rootScope, dbURL)
{
	return{
		login : function(userCred)
		{
			var ref = new Firebase(dbURL);
			console.log("Received the login details. Attempting to login.");
			console.log("email id is: " + userCred.mail);
			console.log("password is: " + userCred.password);
			ref.authWithPassword
			(
				{
					email	 : userCred.mail,
					password : userCred.password
				}, 
				function(error, user) 
				{
					if (error) 
					{
						console.log("Invalid Credentials.");
						$rootScope.$broadcast('loginFail');
					}
					else 
					{
						console.log("Logged in as:", user.uid);
						$rootScope.$broadcast('loginSuccess');
					}
				}
			);
		}
	}
}]);

app.factory("LocationService",["dbURL", "UserDataService", function(dbURL, UserDataService)
{
	var factory = {};
	var orgid = UserDataService.getUserOrg();

	factory.getLocationList = function()
	{
		var locationList = [];
		var locRef = new Firebase(dbURL + 'locations/' + orgid);
		locRef.on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var locId = childSnapshot.key();
				var locData = childSnapshot.val();
				locationList.push(locData);		
				console.log("SELECTED -> " + locData.districtName + ":" + locData.stateName);
			});
		});
		return locationList;
	}
	
	factory.getLocationId = function(state,district)
	{
		var locRef = new Firebase(dbURL + 'locations/' + orgid);
		var locId = "";
		locRef.on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				locId = childSnapshot.key();
				var locData = childSnapshot.val();
				if(angular.equals(locData.districtName, district) && angular.equals(locData.stateName, state))
				{
					console.log("location id: " + locId + ", district name: " + locData.districtName + ", state name: " + locData.stateName);
					return true;
				}
			});
		});
		return locId;
	}
	
	return factory;
}]);

app.factory("ProjectService",["dbURL", "UserDataService", "$rootScope", "LocationService", function(dbURL, UserDataService, $rootScope, LocationService)
{
	var factory = {};
	
	var orgid = UserDataService.getUserOrg();
	
	factory.getProjectList = function()
	{
		var projectList = [];	
		var projRef = new Firebase(dbURL + 'projects/' + orgid);
		projRef.on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var projId = childSnapshot.key();
				var projData = childSnapshot.val();
				projectList.push(projData);		
				console.log("SELECTED -> " + projData.projectName + ":" + projData.projectManager + ":" + projData.projectDescription + ":" + projData.startDate + ":" + projData.endDate + ":" + projData.duration);
			});
		});
		return projectList;
	}
	
	factory.addProjectInstance = function(instanceData)
	{
				$rootScope.locId = LocationService.getLocationId(instanceData.state, instanceData.district);

        $rootScope.$watch('locId', function()
		{
			var insRef = new Firebase(dbURL + 'instances/' + orgid + "/" + $rootScope.locId + "/" + instanceData.instanceId);
			console.log("looking for : " + insRef.toString());
		});
		
		/*			insRef.on("value", function(insnapshot) {
						if(insnapshot.exists())
						{
							var insdata = insnapshot.val();
							console.log("The address found is : " + insdata.address);
							$rootScope.$broadcast('instanceAddFail');
						}
						else
						{
							insRef.set({address: instanceData.address},
							function(error)
							{
								if(error)
								{
									$rootScope.$broadcast('instanceAddFail');
								}
								else
								{
									$rootScope.$broadcast('instanceAddSuccess');
								}
								
							});
						}
					});		*/
	}
	return factory;
}]);

app.factory("InstanceService",["dbURL", "UserDataService", function(dbURL, UserDataService)
{
	var factory = {};

	factory.getInstanceList = function()
	{
		var instanceList = [];
		var orgid = UserDataService.getUserOrg();
		var insRef = new Firebase(dbURL + 'instances/' + orgid);
		insRef.on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var locid = childSnapshot.key().toString();
				console.log("The locid is: " + locid);
				var locRef = new Firebase(dbURL + 'instances/' + orgid + "/" + locid);
				locRef.on("value", function(inschildSnapshot){
					inschildSnapshot.forEach(function(instanceSnapshot) {
						var insId = instanceSnapshot.key();
						var insData = instanceSnapshot.val();
						instanceList.push(insData);		
						console.log("SELECTED -> " + insData.address);
					});
				});
			});
		});
		return instanceList;
	}
	return factory;
}]);

app.factory("PeopleService",["dbURL", "UserDataService", function(dbURL, UserDataService)
{
	var factory = {};

	factory.getPeopleList = function()
	{
		var peopleList = [];
		var orgid = UserDataService.getUserOrg();
		var pplRef = new Firebase(dbURL + 'personnel/' + orgid);
		pplRef.on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var pplid = childSnapshot.key();
				var pplData = childSnapshot.val();
				peopleList.push(pplData);		
				console.log("SELECTED -> " + pplData.employeeName + ":" + pplData.employeeRole + ":" + pplData.employeeMail + ":" + pplData.gender + ":" + pplData.number);
			});
		});
		return peopleList;
	}
	return factory;
}]);

app.factory("ItemService",["dbURL", "UserDataService", function(dbURL, UserDataService)
{
	var factory = {};

	factory.getItemList = function()
	{
		var itemList = [];
		var orgid = UserDataService.getUserOrg();
		var itemRef = new Firebase(dbURL + 'inventory/' + orgid);
		itemRef.on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var itemid = childSnapshot.key();
				var itemData = childSnapshot.val();
				itemList.push(itemData);		
				console.log("SELECTED -> " + itemData.itemName + ":" + itemData.itemQuantity);
			});
		});
		return itemList;
	}
	return factory;
}]);


app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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

	$stateProvider.state('app.login', {
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
	
	$stateProvider.state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

	$stateProvider.state('app.signUp', {
        url: '/signUp',
        views: {
            'menuContent': {
                templateUrl: 'templates/signUp.html',
                controller: 'SignUpCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
	
    $stateProvider.state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    $stateProvider.state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

	$stateProvider.state('app.notifications', {
        url: '/notifications',
        views: {
            'menuContent': {
                templateUrl: 'templates/notifications.html',
                controller: 'NotificationsCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    $stateProvider.state('app.projects', {
        url: '/projects',
        views: {
            'menuContent': {
                templateUrl: 'templates/projects.html',
                controller: 'ProjectsCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    $stateProvider.state('app.funds', {
        url: '/finance',
        views: {
            'menuContent': {
                templateUrl: 'templates/funds.html',
                controller: 'FundsCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

	$stateProvider.state('app.personnel', {
        url: '/personnel',
        views: {
            'menuContent': {
                templateUrl: 'templates/personnel.html',
                controller: 'PersonnelCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

	$stateProvider.state('app.location', {
        url: '/location',
        views: {
            'menuContent': {
                templateUrl: 'templates/location.html',
                controller: 'LocationCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

	$stateProvider.state('app.inventory', {
        url: '/inventory',
        views: {
            'menuContent': {
                templateUrl: 'templates/inventory.html',
                controller: 'InventoryCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

	$stateProvider.state('app.analytics', {
        url: '/analytics',
        views: {
            'menuContent': {
                templateUrl: 'templates/analytics.html',
                controller: 'AnalyticsCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
