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
   * Adds a new order with payment info and shipping/billing address.
   * 
   * @param {Object} paymentInfo object containing payment info.
   * @param {Object} addressInfo object containing address info.
   * @param {Object} orderInfo object containing the ordered items, total price and user.
   * 
   * @return {Promise} the promise object.
   */
  addOrder: function(paymentInfo, addressInfo, orderInfo) {
    
    return new Promise(function(resolve, reject) {

      let totalPrice = orderInfo.totalPrice
      ,   items = orderInfo.items
      ,   user = orderInfo.user;
      
      invariant(_.isNumber(totalPrice), `OrderAction.addOrder() expects a number as totalPrice.`);
      invariant(!_.isEmpty(items), `OrderAction.addOrder() expects non-empty items.`);
      invariant(!_.isEmpty(user), `OrderAction.addOrder() expects a non-empty user.`);
      
      let order = {
        user: user._id,
        charge: {
          amount: totalPrice,
          currency: "usd",
          source: paymentInfo.id
        },
        payment: paymentInfo,
        address: addressInfo,
        items: Object.keys(items)
      };
      
      request.post("/api/orders")
        .send({ order: JSON.stringify(order) })
        .then(function(res) {
          ShoppingCartAction.clearCart();
          
          resolve(res.body);
        })
        .catch(function(err) {
          reject(err.body);
        });

    });
  },
  
  /**
   * Gets all the orders.
   * 
   * @return {Promise} the promise object.
   */
  getOrders: function() {
    
    // mark as loading
    AppDispatcher.handleAction({
      actionType: OrderManageConstants.SETS_IS_LOADING,
      isLoading: true
    });
    
    return new Promise(function(resolve, reject) {
      
      request.get("/api/orders")
        .then(function(res) {
          let orders = res.body;
          
          invariant(_.isArray(orders), `getOrders() expects response.body to be an array, but gets '${typeof orders}'.`)
          
          AppDispatcher.handleAction({
            actionType: OrderManageConstants.RECEIVED_ORDERS,
            orders: orders
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getOrders() expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        })
        .finally(() => {
          
          AppDispatcher.handleAction({
            actionType: OrderManageConstants.SETS_IS_LOADING,
            isLoading: false
          });
          
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
