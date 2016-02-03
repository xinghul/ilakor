+function () {
  "use strict";

  module.exports = {

    'facebookAuth' : {
      'clientID'      : '1015863301820553',
      'clientSecret'  : '6ed78eb8641f7fcd84f3988ab96fb5dc',
      'callbackURL'   : 'http://localhost:3001/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'       : 'KCtxYNqyJ0MmSWJMP7HOufqst',
      'consumerSecret'    : 'SFXz4puhunLVdDohShOpRp0agBczItkIVptlzHPPsU2C1hQ0Gx',
      'callbackURL'       : 'http://levi-lu.net/auth/twitter/callback'
    },

    'googleAuth' : {
      'clientID'      : '318050669830-gu9uvlu6o32vmcjr1l37r0f0hmna485u.apps.googleusercontent.com',
      'clientSecret'  : 'OuqV02tifMAclJCDonlkkYgY',
      'callbackURL'   : 'http://levi-lu.net/auth/google/callback'
    }

  };

}();
