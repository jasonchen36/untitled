const //services
    util = require('./util'),
    session = require('./session');

var user = {};

user.getDataObject = function(req){
    return util.mergeObjects([
        session.getUserObject(req),//user
        session.getTaxProfileObject(req),//account,
        session.getPersonalProfileObject(req)//personal profile
    ]);
};

module.exports = user;