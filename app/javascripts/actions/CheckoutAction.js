"use strict";

import request from "superagent-bluebird-promise"
import Promise from "bluebird"
import _ from "lodash"

import AppDispatcher from "dispatcher/AppDispatcher"

let CheckoutAction = {
  
  /**
   * Checks out with given state and user.
   * 
   * @param {Object} state state object containing checkout info.
   *
   * @param {Object} user user object.
   * 
   * @return {Promise} the promise object.
   */
  checkout: function(state, user) {
    
    return new Promise(function(resolve, reject) {
      Stripe.card.createToken({
        number: state.cardNumber,
        exp_month: state.expireMonth,
        exp_year: state.expireYear,
        cvc: state.cvc
      }, function(status, response) {
        if (response.error) {
          return reject(response.error);
        }
        
        let token = response.id
        ,   charge = {
          user: _.isEmpty(user) ? "" : user._id,
          address: {
            name: `${state.firstName} ${state.lastName}`,
            phone: state.phoneNumber,
            email: state.email,
            street: state.street,
            city: state.city,
            state: state.state,
            zip: state.zip
          },
          charge: {
            amount: state.totalPrice,
            currency: "usd",
            source: token
          },
          items: Object.keys(state.items)
        };
        
        request.post("/charge")
          .send({charge: JSON.stringify(charge)})
          .then(function(res) {
            resolve(res.body);
          })
          .catch(function(err) {
            reject(err);
          });
          
      });

    });
  }

};

export default CheckoutAction;
