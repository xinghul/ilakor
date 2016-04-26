"use strict";

let express    = require("express")
,   fs         = require("fs")
,   multiparty = require("multiparty")
,   jwt        = require("jsonwebtoken")
,   _          = require("underscore");

let router = express.Router()
,   Item   = require("./api/item")
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
    limit = req.query.limit;
    skip = req.query.skip;
    
    Item.getAll(skip, limit).then(function(items) {
      res.status(200).json(items);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error"));
    });
  }

})
.post(function(req, res, next) {
  
  let form = new multiparty.Form();
  
  form.parse(req, function(err, fields, files) {
    
    let rawData = JSON.parse(fields.item[0])
    ,   images  = files.image;

    Item.add(rawData).then(function(newItem) {
      return Item.uploadImage(newItem, images);
    }).then(function(updatedItem) {
      res.status(200).json(updatedItem);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));
    });
  });
  
  return;
  
  // enable this when request support ES6
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

  Item.add(rawData).then(function(newItem) {
    res.status(200).json(newItem);
  }).catch(function(err) {
    console.log(err.stack);
    
    next(new CustomError(500, "Internal error."));
  });
  
})
.put(function(req, res, next) {
  let itemId   = req.itemId
  ,   newValue = JSON.parse(req.body.item) ;
  
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
    Item.remove(itemId).then(function(item) {
      res.status(200).json(item);
    }).catch(function(err) {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));
    });
  } else {
    next(new CustomError(400, "Item id not specified!"));
  }
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