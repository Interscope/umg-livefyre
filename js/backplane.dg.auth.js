/*Backplane.subscribe(function(bpMessage){
	if(bpMessage.type && bpMessage.type == 'identity/login'){
		//Backplane.expectMessages('identity/ack');
		console.log(bpMessage);
	}
});
window.Backplane.expectMessages('identity/login');*/

if(typeof define === "function"){ define(["fyre","jquery"],_iga_lf_auth);}else{_iga_lf_auth(fyre, jQuery);}
function _iga_lf_auth(fyre, $){
	// Takes an instance of the Backplane object
	var authDelegate = new fyre.conv.BackplaneAuthDelegate(window.Backplane);
	
	/**
	 * Login function
	 * Change to however login process is started
	 */
	authDelegate.login = function(delegate) {
		var successCallback = function() {
			delegate.success();
			if(typeof janrain != "undefined"){
				janrain.events.onCaptureLoginSuccess.removeHandler(successCallback);
				janrain.events.onModalClose.removeHandler(failureCallback);
			}
		};

		var failureCallback = function() {
			delegate.failure();
			if(typeof janrain != "undefined"){
				janrain.events.onModalClose.removeHandler(failureCallback);
				janrain.events.onCaptureLoginSuccess.removeHandler(successCallback);
			}
		};
		
	    //CAPTURE.startModalLogin();
	    $('a.janrain_capture_signin').first().click();
	    //window.Backplane.expectMessages('identity/login');
	    if(typeof janrain != "undefined"){
	    	janrain.events.onCaptureLoginSuccess.addHandler(successCallback);
	    	janrain.events.onModalClose.addHandler(failureCallback);
	    }
	};
	
	/*Backplane.subscribe(function(backplane){
		if(backplane.message && backplane.message.type == 'identity/login'){
			//Backplane.expectMessages('identity/ack');
			successCallback();
		}
	});*/
	
	/**
	 * Logout function
	 * Change to however logout process is started
	 */
	authDelegate.logout = function(delegate) {
	    if(CAPTURE.invalidateSession){CAPTURE.invalidateSession();}
	    // Need to reset the Backplane channel ID prior to calling
	    // fyre.conv.BackplaneAuthDelegate.prototype.logout
	    Backplane.resetCookieChannel();
	    fyre.conv.BackplaneAuthDelegate.prototype.logout.call(this, delegate);
		CAPTURE.logout();
	};
	
	// Uncomment ONLY IF you need to check whether user fulfilled verification requirement (such as email verify) AND ONLY IF you have defined an isUserVerified() function
	/**
	 * Fetch User Data function
	 * Implement this function if you want to validate user status prior to 
	 * authenticating the user. Define a function that returns a boolean value: true if the user is verified; false otherwise.
	 */
	/*
	authDelegate.fetchAuthData = function(delegate) {
	    if (isUserVerified()) { // client would implement isUserVerified as described in the above comment
	        delegate.base();
	    }
	};
	*/
	
	/**
	 * View profile function
	 * Arguments are delegate parameter and an author parameter
	 * Used any time a view profile event is triggered
	 */
	function view_editProfile(){
		return $('#block-janrain-capture-ui-janrain-capture .middle .item-list ul li.first a').first().click();
	}
	
	authDelegate.viewProfile = function(delegate, author) { //@todo showing other people's profiles
		view_editProfile();
	};
	
	/**
	 * Edit profile function
	 * Arguments are delegate parameter and an author parameter
	 * Used any time an edit profile event is triggered
	 */
	authDelegate.editProfile = function(delegate, author) {
		view_editProfile();
	};
	
	/** @example
	 * Initializing the conversation
	 * In the Backplane case, only a couple modifications are necessary:
	 *  - Add a network
	 *  - Add the authDelegate (in this case, the Backplane version)
	 *
	 * fyre.conv.load({
	 *    network: 'umg',
	 *    authDelegate: authDelegate
	 * }, [{
	 *    ...
	 * }]);
	 */
	window.authDelegate = authDelegate;
	return authDelegate;
};