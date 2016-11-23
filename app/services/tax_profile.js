const //services
    session = require('../services/session'),
    taxProfile = {};

taxProfile.saveName = function(req){
    const accountName = req.body.name;
    req.session.account['name'] = accountName;
};

taxProfile.saveFilingType = function(req){
    const filingForMyself = req.body.myself,
        filingForSpouse = req.body.spouse,
        filingForOther = req.body.other;
    req.session.account['filingType'] = {
        myself: filingForMyself,
        spouse: filingForSpouse,
        other: filingForOther
    };
};

taxProfile.getValue = function(req, key){
    const accountSession = session.getAccountObject(req);
    return accountSession.hasOwnProperty(key)?accountSession[key]:'';
};

module.exports = taxProfile;