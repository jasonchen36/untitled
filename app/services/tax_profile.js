const //services
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

module.exports = taxProfile;