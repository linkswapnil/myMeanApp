myApp.service("authService", function($q, $timeout, $resource){
    console.log("Instantiating auth service");
    var self = this;
    this.authenticated = false;
    this.authorize = function(moduleName) {
        return this
            .checkAuthorization(moduleName)
            .then(function(info){
                console.log("Checking authentication status", info);
                if (info.authenticated === true)
                    return true;
                // anonymous
                throw new AuthorizationError();
            });
    };
    this.checkAuthorization = function(moduleName) {
        console.log("Acquiring authentication info for", moduleName);
        $resource.get('/')
    };
});

// Custom error type
function AuthorizationError(description) {
    this.message = "Forbidden";
    this.description = description || "User authentication required.";
}

AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.constructor = AuthorizationError;
