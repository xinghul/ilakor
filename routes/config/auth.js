+function () {
  "use strict";

  module.exports = {

    'facebookAuth' : {
      'clientID'      : '1745705295669171',
      'clientSecret'  : '6538dc8477c05f9d9835d11f2bb44616',
      'callbackURL'   : '/auth/facebook/callback'
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
