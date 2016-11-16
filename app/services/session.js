const session = {};

session.actionStartAccountSession = function(req){
    //todo, communicate with api
    //todo, store account id in cookie
    //todo, add expiry timestamp 1 week
    req.session.account = {
        id: true
    }
};

session.actionDestroyAccountSession = function(req){
    //todo, communicate with api
    req.session.account = {};
};

session.getAccountSession = function(req){
    //todo, timestamp validation
    return req.session.account && req.session.account.id;
};

session.getAccountObject = function(req){
    if (session.getAccountSession(req)){
        return {
            hasSession: true
        };
    } else {
        return {};   
    }
};

module.exports = session;