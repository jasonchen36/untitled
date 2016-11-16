const session = {};

session.actionStartUserSession = function(req){
    //todo, communicate with api
    req.session.user = {
        isLoggedIn: true
    }
};

session.actionDestroyUserSession = function(req){
    //todo, communicate with api
    req.session.user = {};
};

session.getUserLoggedIn = function(req){
    //todo, add expiry timestamp and validation
    return req.session.user && req.session.user.isLoggedIn;
};

session.getUserObject = function(req){
    if (session.getUserLoggedIn(req)){
        return {
            isLoggedIn: true
        };
    } else {
        return {};   
    }
};

module.exports = session;