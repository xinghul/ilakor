"use strict";

let FB = require("fb");

FB.setAccessToken("CAAOb7BsZB0IkBAASe7ZC4ZCdskwWEW6ZCNrioqZAvHBHd6ZBiZCKzwNYTbZCSdeeto5g0YZAr6M808OLSTKtg9cU3OMoZBknxQeZBbCEJNvZBFk3Lt2Ta1j7z9wNo3VDU8wZBvZBP2beEAQbTKCHk4VGalZBmbn1AAxd58LITzrdGyOBdXU1T5Hlpqmt4hwKr5ZByiTgM5UZD");


FB.api("/me/feed", function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  
  console.dir(res);
});