/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
	
    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

	$scope.toggleSideMenu = function() {
 	   $scope.sideMenuController.toggleLeft();
  	};
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, $location, LoginService, UserDataService, dbURL)
{
   $scope.$parent.clearFabs();
   $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
	
	$scope.ref = new Firebase(dbURL);
	$scope.loginData = { mail : "",
						 password : "",
						 ErrorMessage : ""
					   };
/*
	var auth = $scope.ref.getAuth();
	if(auth)
	{
	console.log("uid: " + auth.uid);
	$scope.ref.unauth();
	}
	*/		
	$scope.loginUser = function()
	{
		if($scope.loginData.mail && $scope.loginData.password)
		{
		    $scope.$on('loginFail', function()
			{
				$scope.loginData.ErrorMessage = "Wrong Credentials";
				$scope.$apply();
				console.log("error message in controller: " + $scope.loginData.ErrorMessage);
			})
			$scope.$on('loginSuccess', function()
			{
				$scope.$on('userDataDone', function()
				{
						$timeout(function(){$location.path("/app/home");},0);
				})
				UserDataService.setUserData();
			})
			
			LoginService.login($scope.loginData);		
		}
		else
		{
			console.log("Missing Fields");
			$scope.loginData.ErrorMessage = "Missing Fields";
		}
	}
	
	$scope.resetLoginFields = function()
	{
		if(!angular.equals($scope.loginData.ErrorMessage, ""))
		{
			$scope.loginData.mail = "";
			$scope.loginData.password = "";
			$scope.loginData.ErrorMessage = "";
		}
	}
	
	$scope.forgotPassword = function()
	{
		if($scope.loginData.mail)
		{
			console.log("Received the email id.");
			$scope.ref.resetPassword(
			{
				email: $scope.loginData.mail
			}, 
			function(error)
			{
				if (error)
				{
					switch (error.code)
					{
						case "INVALID_USER":
							console.log("The specified user account does not exist.");
							alert("The specified user account does not exist. Do provide a valid email");
							break;
						default:
						console.log("Error resetting password:", error);
						alert("The password could not be reset. Please try again later.");
					}
				}
				else
				{
					console.log("Password reset email sent successfully!");
					alert("Password reset email sent successfully!");
				}
			});
		}
	}
    ionicMaterialInk.displayEffect();
})

.controller('RegisterCtrl', function($scope, $firebaseObject, $location, $timeout, ionicMaterialInk, dbURL)
{
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
	
	$scope.orgData = {
						orgName 	: "",
						orgMail 	: "",
						code		: "",
						dbRef 		: "",
						ErrorMessage: ""
					 };
	
	console.log("Waiting for Organisation details to register.");

	$scope.resetRegOrgFields = function()
	{
		if(!angular.equals($scope.orgData.ErrorMessage, ""))
		{
			$scope.orgData.orgName = "";
			$scope.orgData.orgMail = "";
			$scope.orgData.ErrorMessage = "";
		}
	}
	
	var addOrganisationData = function()
	{
	    console.log("It is a new Organisation. Hence, attempting to save the organisation details.");
				
		$scope.dbRef.set({orgName : $scope.orgData.orgName, orgMail : $scope.orgData.orgMail},
		function(error)
		{
		    if(error)
			{
			    alert("Unable to register the organisation. Do try again after a while.");
		        console.log("Adding organisation details failed.");
			}
			else
			{
				var orgFoundString = "The organisation has been successfully registered.\n";
		        orgFoundString += "The code generated for the organisation is : " + $scope.orgData.code;
		        orgFoundString += "\nUse this code while Signing Up for an account.";
		        alert(orgFoundString);
			    console.log("The organisation " + $scope.orgData.orgName + " has been added.");
			}
			$scope.$emit('orgDataDone');
		});
	}
	
	$scope.registerOrganisation = function()
	{
		if ($scope.orgData.orgName && $scope.orgData.orgMail)
		{
		    console.log("Received the organisation details.");
			
		    $scope.orgData.code =  CryptoJS.SHA1($scope.orgData.orgName).toString().substring(0,6);
			
			var url = dbURL + 'organisations/' + $scope.orgData.code;
			$scope.dbRef = new Firebase(url);
			$scope.dbRef.once("value", function(snapshot) 
			{
				if(snapshot.exists())
				{
					console.log("The organisation " + snapshot.val().orgName + " is already registered.");
					var orgFoundString = "The organisation is already registered.\n";
					orgFoundString += "The code generated for the organisation is : " + $scope.orgData.code;
					orgFoundString += "\nUse this code while Signing Up for an account.";
					$scope.orgData.ErrorMessage =  orgFoundString;
					$scope.$apply();
				}
				else
				{
					$scope.$on('orgDataDone', function()
					{
						$timeout(function(){$location.path("/login");},0);
					})
					addOrganisationData();
				}
			});
		}
		else
		{
			$scope.orgData.ErrorMessage = "Missing Fields";
		}
	}
	
	$scope.cancelRegistration = function()
	{
	    console.log("Organisation Registration action is cancelled by the user");
	    $scope.orgName = "";
		$scope.orgMail = "";
	    $location.path("/login");
	}
	
	ionicMaterialInk.displayEffect();
})

.controller('SignUpCtrl', function($scope, $firebaseObject, $location, $timeout, ionicMaterialInk, LoginService, UserDataService, dbURL)
{
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
	
	$scope.userData = {	userName 	: "",
						userMail 	: "",
						userOrgCode : "",
						userPassword: "",
						ErrorMessage: ""
						};
						
	console.log("Waiting for User details to register.");

    $scope.resetSignFields = function()
	{
		$scope.userData.ErrorMessage = "";
	}
	
	var addUserData = function(authId)
	{
		var userDbRef = new Firebase(dbURL);
		var userPath = userDbRef.child("users/" + authId);
		userPath.set({userName: $scope.userData.userName, userMail: $scope.userData.userMail, userOrgCode: $scope.userData.userOrgCode},
		function(error)
		{
			if(error)
			{
				userDbRef.removeUser({
										email: $scope.userData.userMail,
										password: $scope.userData.userPassword
									});
				$scope.userData.ErrorMessage = "Registration unsuccessful. Do try after sometime.";
				$scope.userData.userName = "";
				$scope.userData.userMail = "";
				$scope.userData.userOrgCode = "";
				$scope.userData.userPassword = "";
				$scope.$apply();
				console.log("Error adding user data");
			}
			else
			{
				console.log("User details added");
				var cred = {mail : $scope.userData.userMail, password : $scope.userData.userPassword};
				
				$scope.$on('loginFail', function()
				{
					$scope.userData.ErrorMessage = "Wrong Credentials";
					$scope.$apply();
					console.log("error message in controller: " + $scope.loginData.ErrorMessage);
				})
				$scope.$on('loginSuccess', function()
				{
					$scope.$on('userDataDone', function()
					{
						$timeout(function(){$location.path("/app/home");},0);
					})
					UserDataService.setUserData();
				})
			
				LoginService.login(cred);
			}
		});
	}
	
	$scope.registerUser = function()
	{
	    if ($scope.userData.userName && $scope.userData.userMail && $scope.userData.userPassword && $scope.userData.userOrgCode)
		{
			console.log("Received the user details. Verifying if the organisation code is valid.");
			var userDbRef = new Firebase(dbURL);
	        userDbRef.once("value", function(snapshot) 
			{
				if(snapshot.hasChild("organisations/" + $scope.userData.userOrgCode))
				{
					console.log("The organisation is registered. Attempting to register the user.");
					userDbRef.createUser
					(
						{
							email    : $scope.userData.userMail,
							password : $scope.userData.userPassword
						},
						function(error, userRec) 
						{
							if (error) 
							{
								switch (error.code)
								{
									case "EMAIL_TAKEN":
										console.log("The new user account cannot be created because the email is already in use." + $scope.userMail);
										$scope.userData.ErrorMessage = "The new user account cannot be created because the email is already in use.";
										$scope.userData.userMail = "";
										$scope.$apply();
										break;
									case "INVALID_EMAIL":
										console.log("The specified email is not valid : " + $scope.userMail);
										$scope.userData.ErrorMessage = "The specified email is not valid.";
										$scope.userData.userMail = "";
										$scope.$apply();
										break;
									default:
										console.log("Error creating user:", error);
										$scope.userData.ErrorMessage = "Registration unsuccessful. Do try after sometime.";
										$scope.userData.userMail = "";
										$scope.$apply();
								}
							} 
							else 
							{
								addUserData(userRec.uid);
							}
						}
					);
				}
				else
				{
				    console.log("Invalid Organisation Code: " + $scope.userData.userOrgCode);
					$scope.userData.ErrorMessage = "Invalid Organisation Code. Do register your organisation before signing up.";
					$scope.userData.userOrgCode = "";
					$scope.$apply();
				}
			});
		}
		else
		{
			$scope.userData.ErrorMessage = "Missing Fields";
		}
	}
	
	$scope.cancelUserRegister = function()
	{
		console.log("User Registration action is cancelled by the user");
	    $scope.userData.userName = "";
		$scope.userData.userMail = "";
		$scope.userData.userOrgCode = "";
		$scope.userData.userPassword = "";
		$location.path("/login");
	}
	
	ionicMaterialInk.displayEffect();
})


.controller('NotificationsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProjectsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	// Set Header
    $scope.$parent.showHeader();
    //$scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(true);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

	$scope.users = [];

	// Control for Projects
	var ref = new Firebase("https://pronirvahanadb.firebaseio.com/users");
	ref.on("value", function(snapshot) {
	  	// The callback function will get called depending on the number of entries
	  	snapshot.forEach(function(childSnapshot) {
	    // key will be <user1> the first time and <user2> the second time and so on
	    var key = childSnapshot.key();
	    // childData will be the actual contents of the child
	    var childData = childSnapshot.val();
    	childData['$id'] = key;
    	$scope.users.push(childData);
		
		console.log("SELECTED -> " + childData.userName + " " + childData.userMail + " " +childData.userOrgCode);
	  });
	});
})

.controller('PersonnelCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('LocationCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('FundsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('InventoryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('AnalyticsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('HomeCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

;
