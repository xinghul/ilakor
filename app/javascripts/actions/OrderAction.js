"use strict";

import request from "superagent-bluebird-promise"
import Promise from "bluebird"
import _ from "lodash"
import invariant from "invariant"

import AppDispatcher from "dispatcher/AppDispatcher"
import ShoppingCartAction from "actions/ShoppingCartAction"
import OrderManageConstants from "constants/OrderManageConstants"

let OrderAction = {
  
  /**
   * Adds a new order with state containing order information and user.
   * 
   * @param {Object} state state object containing checkout info.
   * @param {Object} user user object.
   * 
   * @return {Promise} the promise object.
   */
  addOrder: function(state, user) {
    
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
        ,   order = {
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
        
        request.post("/api/orders")
          .send({order: JSON.stringify(order)})
          .then(function(res) {
            ShoppingCartAction.clearCart();
            
            resolve(res.body);
          })
          .catch(function(err) {
            reject(err.body);
          });
          
      });

    });
  },
  
  /**
   * Gets all the orders.
   * 
   * @return {Promise} the promise object.
   */
  getOrders: function() {
    
    return new Promise(function(resolve, reject) {
      
      request.get("/api/orders")
        .then(function(res) {
          let orders = res.body;
          
          invariant(_.isArray(orders), `OrderAction.getOrders() expects an array, but gets '${typeof orders}'.`)
          
          AppDispatcher.handleAction({
            actionType: OrderManageConstants.RECEIVED_ORDERS,
            orders: orders
          });
          
          resolve();
        })
        .catch(function(err) {
          invariant(_.isString(err.message), `OrderAction.getOrders() expects a string as error message, but gets '${typeof message}'.`)
          
          reject(err);
        });

    });
  },
  
  /**
   * Updates an order with new values.
   *
   * @param  {String} id the id for this order.
   * @param  {Object} newValue an object containing new order info.
   *
   * @return {Promise} the promise object.
   */
  updateOrder: function(id, newValue) {
    
    return new Promise(function(resolve, reject) {
      
      request.put("/api/orders")
        .query({id: id})
        .send({order: JSON.stringify(newValue)})
        .then(function(res) {
          let newOrder = res.body;
          
          AppDispatcher.handleAction({
            actionType: OrderManageConstants.RECEIVED_UPDATED_ORDER,
            order: newOrder
          });
          
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });
      
    });
  }

};

export default OrderAction;
