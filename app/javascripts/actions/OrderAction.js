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
   * Adds a new order with values containing order information and user.
   * 
   * @param {Object} values values object containing checkout info.
   * @param {Object} user user object.
   * 
   * @return {Promise} the promise object.
   */
  addOrder: function(values, user) {
    
    return new Promise(function(resolve, reject) {
      
      Stripe.card.createToken({
        number: values.cardNumber,
        exp_month: values.expireMonth,
        exp_year: values.expireYear,
        cvc: values.cvc
      }, function(status, response) {
        if (response.error) {
          return reject(response.error);
        }
        
        let token = response.id
        ,   order = {
          user: user._id,
          address: {
            name: `${values.firstName} ${values.lastName}`,
            phone: values.phoneNumber,
            email: values.email,
            street: values.street,
            city: values.city,
            state: values.state,
            zip: values.zip
          },
          charge: {
            amount: values.totalPrice,
            currency: "usd",
            source: token
          },
          items: Object.keys(values.items)
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
