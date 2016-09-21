"use strict";

let express   = require("express")
,   fs        = require("fs")
,   invariant = require("invariant")
,   jwt       = require("jsonwebtoken")
,   stripe    = require("stripe")("sk_test_Uud0EfP12pR2yvwuuXmZeTds")
,   _         = require("lodash");

let router    = express.Router()
,   Item      = require("./api/item")
,   Order     = require("./api/order")
,   Tag       = require("./api/tag")
,   Brand     = require("./api/brand")
,   Category  = require("./api/category")
,   Variation = require("./api/variation");

let BadRequest    = require("./utils/BadRequest")
,   InternalError = require("./utils/InternalError");

const routeToHandler = {
  tags: Tag,
  brands: Brand,
  categories: Category,
  variations: Variation
};

function SuccessResponse(res, data) {
  return res.status(200).json(data);
}

function InternalErrorResponse(next, err) {
  console.log(err, err.stack);
  
  return next(new InternalError());
}

function BadRequestResponse(next, message) {
  return next(new BadRequest(message));
}

/********************************************************
 *                     Authentication                   *
 ********************************************************/
// logged in is not needed to access the api
// router.use(function(req, res, next) {
// 
//   let token = req.body.token || req.query.token || req.headers["x-access-token"];
//   
//   if (token) {
//     
//     jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
//       if (err) {
//         
//         return res.json({
//           success: false, 
//           message: "Failed to authenticate token."
//         });
//         
//       } else {         
//         next();
//       }
//     });
//     
//   } else {
//     res.status(403).send({
//       success: false,
//       message: "No token provided."
//     });
//   }
// });
 

/********************************************************
 *                      Item Routes                     *
 ********************************************************/

router.route("/items")
.all((req, res, next) => {
  
  let itemId = req.query.id || req.params.id;
  
  if (_.isString(itemId)) {
    req.itemId = itemId;
  }
  
  next();
})
.get((req, res, next) => {
  
  let itemId = req.itemId
  ,   limit
  ,   skip
  ,   query;
  
  if (_.isString(itemId)) {
    Item.get(itemId).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
  } else {
    limit = req.query.limit || req.params.limit;
    skip = req.query.skip || req.params.skip;
    query = req.query.query || req.params.query;
    
    Item.getAll(skip, limit, query).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
  }

})
.post(function(req, res, next) {
  
  let rawData;
  
  if (!req.body.item) {
    return BadRequestResponse(next, "Item info is undefined.");
  }
  
  try {
    rawData = JSON.parse(req.body.item);
  } catch (err) {
    console.log(err.stack);
    
    return BadRequestResponse(next, "Malformed JSON.");
  }

  Item.add(rawData).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
  
})
.put(function(req, res, next) {
  let itemId = req.itemId
  ,   newValue;
  
  try {
    newValue = JSON.parse(req.body.item) 
  } catch (err) {
    console.log(err.stack);
    
    return next(new BadRequest("Malformed JSON."));
  }
  
  if (_.isString(itemId) && _.isObject(newValue)) {
    Item.update(itemId, newValue).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
  } else {
    next(new BadRequest("Item id not specified!"));
  }
})
.delete(function(req, res, next) {
  let itemId = req.itemId;
  
  if (_.isString(itemId)) {
    Item.remove(itemId).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
  } else {
    next(new BadRequest("Item id not specified!"));
  }
});

/********************************************************
 *                     Order Routes                     *
 ********************************************************/
router.route("/orders")
/**
 * Global logic for path '/api/orders'.
 */
.all(function(req, res, next) {

  let orderId = req.query.id || req.params.id
  ,   userId = req.query.user;
  
  if (_.isString(orderId)) {
    req.orderId = orderId;
  }
  
  // used when getting orders for specific user
  if (_.isString(userId)) {
    req.userId = userId;
  }
  
  next();
})
/**
 * Gets orders or a specific order by id.
 */
.get(function(req, res, next) {
  
  let orderId = req.orderId
  ,   userId = req.userId;
  
  if (_.isString(orderId)) {
    
    Order.get(orderId).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    
  } else if (_.isString(userId)) {
    
    Order.getAllByUserId(userId).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    
  } else {
    
    Order.getAll().then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    
  }

})
/**
 * Adds a new order.
 */
.post(function(req, res, next) {
  
  let rawData;
  
  if (!req.body.order) {
    return next(new BadRequest("order info is undefined."));
  }
  
  try {
    rawData = JSON.parse(req.body.order);
  } catch (err) {
    console.log(err.stack);
    
    return next(new BadRequest("Malformed JSON."));
  }
  
  let chargeInfo = rawData.charge;

  stripe.charges.create({
    source: chargeInfo.source,
    amount: chargeInfo.amount,
    currency: chargeInfo.currency
  }).then(function(res) {
    rawData.stripe = res;

    return Order.add(rawData);
  }).then(function(newOrder) {
    res.status(200).json(newOrder);
  }).catch(function(err) {
    console.log(err.stack);
    
    // propagate the stripe error message to frontend
    next(new BadRequest(err.message));
  });
  
})
/**
 * Updates a specific order by id.
 */
.put(function(req, res, next) {
  let orderId = req.orderId
  ,   newValue;
  
  try {
    newValue = JSON.parse(req.body.order) 
  } catch (err) {
    console.log(err.stack);
    
    return next(new BadRequest("Malformed JSON."));
  }
  
  if (_.isString(orderId) && _.isObject(newValue)) {
    Order.update(orderId, newValue).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
  } else {
    next(new BadRequest("Order id not specified!"));
  }
})
/**
 * Deletes a specific order by id.
 */
.delete(function(req, res, next) {
  
});

/********************************************************
 *                  Item Feature Routes                 *
 ********************************************************/
// Return information associated with items like price, stock left, reviews, etc
router.route("/feature")
/**
 * Global logic for path '/api/feature'.
 */
.all(function(req, res, next) {

  let itemId = req.query.id || req.params.id;
  
  if (_.isString(itemId)) {
    req.itemId = itemId;
  }
  
  next();
})
/**
 * Gets a specific item info by id.
 */
.get(function(req, res, next) {
  
  

})
/**
 * Adds a new tag.
 */
.post(function(req, res, next) {
  
  
  
})
/**
 * Updates a specific tag by id.
 */
.put(function(req, res, next) {
  
})
/**
 * Deletes a specific tag by id.
 */
.delete(function(req, res, next) {
  
});

/**
 * Creates the routes for each entry in the routeToHandler.
 */
_.forEach(routeToHandler, (Handler, route) => {
  router.route(`/${route}`)
  /**
   * Global logic for specific route.
   */
  .all((req, res, next) => {

    let reqId  = req.query.id || req.params.id
    ,   item = req.query.item || req.params.item;
    
    if (_.isString(reqId)) {
      req.reqId = reqId;
    }
    
    // if it's variations route, also check if a item id is specified
    if (route === 'variations' && !_.isEmpty(item)) {
      req.item = item;
    }
    
    next();
  })
  /**
   * Gets a specific data by id, return all data if no id specified.
   */
  .get((req, res, next) => {
    
    let reqId  = req.reqId
    ,   item = req.item;
    
    if (_.isString(reqId)) {
      Handler.get(reqId).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    } else {
      Handler.getAll(item).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    }

  })
  /**
   * Adds a new data.
   */
  .post((req, res, next) => {
    
    let rawData;
    
    if (!req.body.data) {
      return BadRequestResponse(next, "Data info undefined.");
    }
    
    try {
      rawData = JSON.parse(req.body.data);
    } catch (err) {
      console.log(err.stack);
      
      return BadRequestResponse(next, "Malformed JSON.");
    }

    Handler.add(rawData).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    
  })
  /**
   * Updates a specific data by id.
   */
  .put((req, res, next) => {
    let reqId = req.reqId
    ,   newValue;
    
    try {
      newValue = JSON.parse(req.body.data);
    } catch (err) {
      console.log(err.stack);
      
      return BadRequestResponse(next, "Malformed JSON.");
    }
    
    if (_.isString(brandId) && _.isObject(newValue)) {
      Handler.update(reqId, newValue).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    } else {
      return BadRequestResponse(next, "Data id not specified!");
    }
  })
  /**
   * Deletes a specific data by id.
   */
  .delete((req, res, next) => {
    let reqId = req.reqId;
    
    if (_.isString(reqId)) {
      Handler.remove(reqId).then(SuccessResponse.bind(null, res)).catch(InternalErrorResponse.bind(null, next));
    } else {
      return BadRequestResponse(next, "Data id not specified!");
    }
  });
});
    
module.exports = router;