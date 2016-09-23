import request from "superagent-bluebird-promise";
import _ from "lodash";
import invariant from "invariant";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import ShoppingCartAction from "actions/ShoppingCartAction";
import OrderManageConstants from "constants/OrderManageConstants";

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
    
    invariant(_.isObject(paymentInfo), `addOrder(paymentInfo, addressInfo, orderInfo) expects 'paymentInfo' as 'object', but gets '${typeof paymentInfo}'.`);
    invariant(_.isObject(addressInfo), `addOrder(paymentInfo, addressInfo, orderInfo) expects 'addressInfo' as 'object', but gets '${typeof addressInfo}'.`);
    invariant(_.isObject(orderInfo), `addOrder(paymentInfo, addressInfo, orderInfo) expects 'orderInfo' as 'object', but gets '${typeof orderInfo}'.`);
    
    return new Promise((resolve, reject) => {

      let totalPrice = orderInfo.totalPrice
      ,   items = orderInfo.items
      ,   user = orderInfo.user;
      
      invariant(_.isNumber(totalPrice), `addOrder(paymentInfo, addressInfo, orderInfo) expects a number as totalPrice.`);
      invariant(!_.isEmpty(items), `addOrder(paymentInfo, addressInfo, orderInfo) expects non-empty items.`);
      invariant(!_.isEmpty(user), `addOrder(paymentInfo, addressInfo, orderInfo) expects a non-empty user.`);
      
      let order = {
        user: user._id,
        charge: {
          amount: totalPrice * 100,
          currency: "usd",
          source: paymentInfo.id
        },
        payment: paymentInfo,
        address: addressInfo,
        items: items
      };
      
      console.log(order);
      
      request.post("/api/orders")
        .send({ order: JSON.stringify(order) })
        .then((res) => {
          ShoppingCartAction.clearCart();
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addOrder(paymentInfo, addressInfo, orderInfo) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
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
    
    return new Promise((resolve, reject) => {
      
      request.get("/api/orders")
        .then((res) => {
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
          
          reject(new Error(message));
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
    
    invariant(_.isString(id), `updateOrder(id, newValue) expects 'id' to be 'string', but gets '${typeof id}'.`);
    invariant(_.isObject(newValue), `updateOrder(id, newValue) expects 'newValue' to be 'object', but gets '${typeof newValue}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.put("/api/orders")
        .query({ id: id })
        .send({ order: JSON.stringify(newValue) })
        .then((res) => {
          let newOrder = res.body;
          
          invariant(_.isObject(newOrder), `updateOrder(id, newValue) expects response.body to be 'object', but gets '${typeof newOrder}'.`);
          
          AppDispatcher.handleAction({
            actionType: OrderManageConstants.RECEIVED_UPDATED_ORDER,
            order: newOrder
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getOrders() expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });
      
    });
  }

};

export default OrderAction;
