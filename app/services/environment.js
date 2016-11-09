const environment = {};

environment.isProduction = function(){
    return process.env.NODE_ENV.toLowerCase() === 'production';
};

module.exports = environment;