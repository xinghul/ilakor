"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

let S3 = require("../service/s3");

let Item     = mongoose.model("Item")
,   Feature  = mongoose.model("Feature")
,   ObjectId = mongoose.Types.ObjectId;

let imageExtensionReg = new RegExp(/.+\.(gif|jpe?g|png)$/i);

let ItemApi = {
  
  /**
   * Creates a new item.
   * 
   * @param  {Object} rawData the raw data containing the new item info.
   *
   * @return {Object} the promise object.
   *
   * rawData schema:
   * {
   * 	 name: String,
   * 	 tag: [String],
   * 	 image: [String],
   * 	 weight: Number,
   * 	 dimension: {
   * 	 	length: Number,
   * 		width: Number,
   * 		height: Number
   * 	 },
   * 	 description: { ... }
   * }
   */
   add: function(rawData) {
     
     return new Promise(function(resolve, reject) {
       
       let item = new Item(rawData)
       ,   feature;

       item.save(function(err, newItem) {
         if (err) {
           reject(err);
         } else {
           resolve(newItem);
         }
       });
       
     });

   },
   
   /**
    * Removes item specified by given id, if it exists.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise} the new promise object.
    */
   remove: function(id) {
     
     return new Promise(function(resolve, reject) {
       
       Item.remove({_id: ObjectId(id)}, function(err, result) {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
       
     });
     
   },
   
   /**
    * Updates item specified by given id with new value.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise} the new promise object.
    */
   update: function(id, newValue) {
     
     return new Promise(function(resolve, reject) {
       
       Item.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true}, function(err, updatedItem) {
         if (err) {
           reject(err);
         } else {
           resolve(updatedItem);
         }
       });
       
     });
     
   },
   
   /**
    * Returns item specified by given id, if it exists.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise} the new promise object.
    */
   get: function(id) {
     
     return new Promise(function(resolve, reject) {
       
       Item.findById(ObjectId(id), function(err, result) {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
       
     });
     
   },
   
   /**
    * Returns all items with given limit.
    *
    * @param {Number} skip the number of records to skip.
    * @param {Number} limit the limit of items to return.
    * 
    * @return {Promise} the new promise object.
    */
   getAll: function(skip, limit) {
     skip = skip || 0;
     // make it 100 for item manage app
     limit = limit || 100;
     
     return new Promise(function(resolve, reject) {
       
       Item
       .find({})
       .skip(skip)
       .limit(limit)
       .exec(function(err, result) {
         if (err) {
           reject(err);
         } else {
           setTimeout(() => {
             resolve(result);
           }, 3000);
         }
       });
       
     });
     
   },
   
   /**
    * Uploads images to s3 and updates the image field.
    * 
    * @return {Promise} the new promise object.
    */
   uploadImage: function(item, images) {
     
     return new Promise(function(resolve, reject) {
       
       let _id        = item._id
       ,   promises   = [];
       
       for (let index = 0; index < images.length; index++)
       {
         let imageFile = images[index]
         ,   matches   = imageFile.originalFilename.match(imageExtensionReg);
         
         // if it matches
         if (matches && matches.length == 2) {
           let extension = matches[1].toLowerCase()
           ,   imageName = _id + '_' + index + '.' + extension;
           
           promises.push(
             S3.uploadImage(imageName, imageFile).then(function(imageUrl) {
               return {
                 name: imageName,
                 url: imageUrl
               };
             })
           );
         }
       }
       
       Promise.all(promises).then(function(images) {
         // stores the images
         item.images = images;
         
         // save the item with images added
         item.save(function(err, updatedItem) {
           if (err) {
             reject(err);
           } else {
             resolve(updatedItem);
           }
         });
       }).catch(function(err) {
         reject(err);
       });
       
     });
     
   },
   
   /**
    * Removes all images associated with item id on S3.
    *
    * @param {String} id the item id.
    * 
    * @return {Promise} the new promise object.
    */
   removeImages: function(id) {
     
     return new Promise(function(resolve, reject) {
       
       Item.findById(ObjectId(id), function(err, item) {
         if (err) {
           reject(err);
         } else {
           let images = item.images,
               promises = [];
           
           for (let image of images)
           {
             promises.push(
               S3.removeImage(image.url)
             );
           }
           
           Promise.all(promises).then(function() {
             resolve();
           }).catch(function(err) {
             reject(err);
           });
         }
       });
       
     });
     
   }

};

module.exports = ItemApi;