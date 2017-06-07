// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1920871271260221', // your App ID
        'clientSecret'  : '208877119d2d94191909958a1f90c0d0', // your App Secret
        'callbackURL'   : 'http://localhost:8000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '115210174900-8qn9cl2q0oqpptmg2ccrkgh7o07fo75f.apps.googleusercontent.com',
        'clientSecret'  : '3M23ZX2UaGUtqM4_USSbVXTk',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback'
    }

};