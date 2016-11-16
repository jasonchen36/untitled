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

module.exports = session;