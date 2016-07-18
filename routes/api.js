"use strict";

let express = require("express")
,   fs      = require("fs")
,   jwt     = require("jsonwebtoken")
,   stripe  = require("stripe")("sk_test_jkhA0OtH2wJTqnQYt0hZAbLQ")
,   _       = require("lodash");

let router = express.Router()
,   Item   = require("./api/item")
,   Order  = require("./api/order")
,   Tag    = require("./api/tag");

let CustomError = require("./utils/CustomError");

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
.all(function(req, res, next) {
  
  let itemId = req.query.id || req.params.id;
  
  if (_.isString(itemId)) {
    req.itemId = itemId;
  }
  
  next();
})
.get(function(req, res, next) {
  
  let itemId = req.itemId
  ,   limit
  ,   skip;
  
  if (_.isString(itemId)) {
    Item.get(itemId).then(function(item) {
      res.status(200).json(item);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error"));
    });
  } else {
    limit = req.query.limit || req.params.limit;
    skip = req.query.skip || req.params.skip;
    
    Item.getAll(skip, limit).then(function(items) {
      res.status(200).json(items);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error"));
    });
  }

})
.post(function(req, res, next) {
  
  let rawData;
  
  if (!req.body.item) {
    return next(new CustomError(400, "Item info undefined."));
  }
  
  try {
    rawData = JSON.parse(req.body.item);
  } catch (err) {
    console.log(err.stack);
    
    return next(new CustomError(400, "Malformed JSON."));
  }

  Item.add(rawData).then(function(updatedItem) {
    res.status(200).json(updatedItem);
  }).catch(function(err) {
    console.log(err.stack);
    
    next(new CustomError(500, "Internal error."));
  });
  
})
.put(function(req, res, next) {
  let itemId = req.itemId
  ,   newValue;
  
  try {
    newValue = JSON.parse(req.body.item) 
  } catch (err) {
    console.log(err.stack);
    
    return next(new CustomError(400, "Malformed JSON."));
  }
  
  if (_.isString(itemId) && _.isObject(newValue)) {
    Item.update(itemId, newValue).then(function(item) {
      res.status(200).json(item);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));
    });
  } else {
    next(new CustomError(400, "Item id not specified!"));
  }
})
.delete(function(req, res, next) {
  let itemId = req.itemId;
  
  if (_.isString(itemId)) {
    Item.remove(itemId).then(function(result) {
      res.status(200).json(result);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));
    });
  } else {
    next(new CustomError(400, "Item id not specified!"));
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
    
    Order.get(orderId).then(function(order) {
      res.status(200).json(order);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error"));
    });
    
  } else if (_.isString(userId)) {
    
    Order.getAllByUserId(userId).then(function(orders) {
      res.status(200).json(orders);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error"));
    });
    
  } else {
    
    Order.getAll().then(function(orders) {
      res.status(200).json(orders);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error"));
    });
    
  }

})
/**
 * Adds a new order.
 */
.post(function(req, res, next) {
  
  let rawData;
  
  if (!req.body.order) {
    return next(new CustomError(400, "order info undefined."));
  }
  
  try {
    rawData = JSON.parse(req.body.order);
  } catch (err) {
    console.log(err.stack);
    
    return next(new CustomError(400, "Malformed JSON."));
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
    
    // deal with error
    next(new CustomError(400, err.message));
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
    
    return next(new CustomError(400, "Malformed JSON."));
  }
  
  if (_.isString(orderId) && _.isObject(newValue)) {
    Order.update(orderId, newValue).then(function(order) {
      res.status(200).json(order);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));
    });
  } else {
    next(new CustomError(400, "Order id not specified!"));
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



/********************************************************
 *                      Tag Routes                      *
 ********************************************************/

router.route("/tags")
  /**
   * Global logic for path '/api/tags'.
   */
  .all(function(req, res, next) {

    let tagId = req.query.id || req.params.id;
    
    if (_.isString(tagId)) {
      req.tagId = tagId;
    }
    
    next();
  })
  /**
   * Gets a specific tag by id.
   */
  .get(function(req, res, next) {
    
    let tagId = req.tagId;
    
    if (_.isString(tagId)) {
      Tag.get(tagId).then(function(tag) {
        res.status(200).json(tag);
      }).catch(function(err) {
        console.log(err.stack);
        
        next(new CustomError(500, "Internal error"));
      });
    } else {
      Tag.getAll().then(function(tags) {
        res.status(200).json(tags);
      }).catch(function(err) {
        console.log(err.stack);
        
        next(new CustomError(500, "Internal error"));
      });
    }

  })
  /**
   * Adds a new tag.
   */
  .post(function(req, res, next) {
    
    let rawData;
    
    if (!req.body.tag) {
      return next(new CustomError(400, "Tag info undefined."));
    }
    
    try {
      rawData = JSON.parse(req.body.tag);
    } catch (err) {
      console.log(err.stack);
      
      return next(new CustomError(400, "Malformed JSON."));
    }

    Tag.add(rawData).then(function(newTag) {
      res.status(200).json(newTag);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));
    });
    
  })
  /**
   * Updates a specific tag by id.
   */
  .put(function(req, res, next) {
    let tagId    = req.tagId
    ,   newValue;
    
    try {
      newValue = JSON.parse(req.body.tag);
    } catch (err) {
      console.log(err.stack);
      
      return next(new CustomError(400, "Malformed JSON."));
    }
    
    if (_.isString(tagId) && _.isObject(newValue)) {
      Tag.update(tagId, newValue).then(function(tag) {
        res.status(200).json(tag);
      }).catch(function(err) {
        console.log(err.stack);
        
        next(new CustomError(500, "Internal error."));
      });
    } else {
      next(new CustomError(400, "Tag id not specified!"));
    }
  })
  /**
   * Deletes a specific tag by id.
   */
  .delete(function(req, res, next) {
    let tagId = req.tagId;
    
    if (_.isString(tagId)) {
      Tag.remove(tagId).then(function(tag) {
        res.status(200).json(tag);
      }).catch(function(err) {
        console.log(err.stack);
        
        next(new CustomError(500, "Internal error."));
      });
    } else {
      next(new CustomError(400, "Tag id not specified!"));
    }
  });

module.exports = router;