const session = {};

session.actionStartAccountSession = function(req){
    //todo, communicate with api
    //todo, store account token in cookie
    //todo, add expiry timestamp 1 week
    req.session.account = {
        hasAccountSession: true
    }
};

session.actionStartUserSession = function(req){
    //todo, communicate with api
    //todo, store account id in cookie
    //todo, add expiry timestamp 1 hour
    req.session.user = {
        hasUserSession: true
    }
};

session.actionDestroyAccountSession = function(req){
    //todo, communicate with api
    req.session.account = {};
};

session.actionDestroyUserSession = function(req){
    //todo, communicate with api
    req.session.user = {};
};

session.getAccountSession = function(req){
    //todo, timestamp validation
    return req.session.account && req.session.account.hasAccountSession;
};

session.getUserSession = function(req){
    //todo, timestamp validation
    return req.session.user && req.session.user.hasUserSession;
};

session.getAccountObject = function(req){
    return req.session.account;
};

session.getUserObject = function(req){
    return req.session.user;
};

module.exports = session;