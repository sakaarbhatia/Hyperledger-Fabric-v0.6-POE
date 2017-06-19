var TAG = "user.service.js";
var chain;


var service = {};

service.setup = setup;

function setup(myChain) {
    if (!myChain)
        throw new Error('User manager requires a chain object');
    chain = myChain;
}


//Generic function to enroll user, not used in this application for now
function enrollUser(enrollID, enrollSecret) {
    return new Promise(function(resolve, reject) {
        if (!chain) {
            reject(new Error('Cannot enrollUser a user before setup() is called.'));
        }
        chain.getMember(enrollID, function(getError, usr) {
            if (getError) {
                reject(getError);
            } else {
                usr.enroll(enrollSecret, function(enrollError, crypto) {
                    if (enrollError) {
                        reject(enrollError);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });

};

//Generic function to register user, not used in this application for now
function registerUser(enrollID) {
    return new Promise(function(resolve, reject) {
        if (!chain) {
            reject(new Error('Cannot register a user before setup() is called.'));
        }

        chain.getMember(enrollID, function(err, usr) {
            if (!usr.isRegistered()) {
                var registrationRequest = {
                    enrollmentID: enrollID,
                    affiliation: 'group1'
                };
                usr.register(registrationRequest, function(err, enrollSecret) {
                    if (err) {
                        reject(err);
                    } else {
                        var cred = {
                            id: enrollID,
                            secret: enrollSecret
                        };
                        resolve(cred);
                    }
                });
            } else {
                reject(new Error('Cannot register an existing user'));
            }
        });
    });
};


module.exports = service;