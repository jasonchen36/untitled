const //packages
    expect = require("chai").expect,
    request = require('request'),
    should = require('should'),
//variables
    testUrl = 'http://localhost:3000',
    debug = false;

describe("User API", function() {

    /**
     * login
     */
    describe("Login", function() {

        it("submit login", function (done) {
            const options = {
                method: 'POST',
                uri: testUrl + '/login',
                form: {
                    action: 'api-login',
                    email: 'test@test.com',
                    password: 'pass1234'
                },
                json: true
            };
            request(options, function (error, response, body) {
                if (debug) {
                    console.log(body);
                }
                expect(response.statusCode).to.equal(200);
                done(body);
            });
        });
    });


    /**
     * reset password
     */
    describe("Reset Password", function() {
        
        it("requests password reset", function(done) {
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
                done(body);
            });
        });
        
        it("submits password reset", function(done) {
            const options = {
                method: 'PUT',
                uri: testUrl+'/password-reset',
                form: {
                    action: 'api-authorized-password-reset',
                    password: 'pass1234',
                    token: '12341234'
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