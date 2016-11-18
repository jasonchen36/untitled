const session = {};

/************ account ************/
session.actionStartAccountSession = function(req){
    //todo, store account token in cookie
    //todo, add expiry timestamp 1 week
    session.actionDestroyAccountSession();
    req.session.account = {
        hasAccountSession: true
    }
};

session.hasAccountSession = function(req){
    //todo, timestamp validation
    return req.session.account && req.session.account.hasAccountSession;
};

session.actionDestroyAccountSession = function(req){
    //todo, communicate with api
    req.session.account = {};
};

session.getAccountObject = function(req){
    return req.session.account;
};


/************ user ************/
session.actionStartUserSession = function(req){
    //todo, store account id in cookie
    //todo, add expiry timestamp 1 hour
    session.actionDestroyUserSession();
    req.session.user = {
        hasUserSession: true
    }
};

session.hasUserSession = function(req){
    //todo, timestamp validation
    return req.session.user && req.session.user.hasUserSession;
};

session.getUserObject = function(req){
    return req.session.user;
};

session.actionDestroyUserSession = function(req){
    //todo, communicate with api
    req.session.user = {};
};

module.exports = session;