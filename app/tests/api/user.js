const //packages
    expect = require("chai").expect,
    request = require('request'),
//variables
    testUrl = 'http://localhost:3000',
    debug = false;

describe("User API", function() {

    describe("Password Reset", function() {
        it("sends a password reset request", function(done) {
            const options = {
                method: 'POST',
                uri: testUrl+'/password-reset',
                form: {
                    action: 'api-password-reset',
                    email: 'test@test.com'
                },
                json: true
            };
            request(options, function(error, response, body) {
                if(debug){
                    console.log(body);
                }
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

});