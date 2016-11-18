const session = {};

session.actionStartAccountSession = function(req){
    //todo, communicate with api
    //todo, store account token in cookie
    //todo, add expiry timestamp 1 week
    req.session.account = {
        id: true
    }
};

session.actionStartUserSession = function(req){
    //todo, communicate with api
    //todo, store account id in cookie
    //todo, add expiry timestamp 1 hour
    req.session.user = {
        id: true
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
    return req.session.account && req.session.account.id;
};

session.getUserSession = function(req){
    //todo, timestamp validation
    return req.session.user && req.session.user.id;
};

session.getAccountObject = function(req){
    return {
        hasAccountSession: this.getAccountSession(req),
        hasUserSession: this.getUserSession(req)
    }
};

module.exports = session;