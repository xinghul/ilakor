"use strict";

let mongoose = require("mongoose")
,   fs = require("fs")
,   path = require("path")
,   Promise  = require("bluebird");

mongoose.promise = require("bluebird");

let S3 = require("../service/s3");

let Item      = mongoose.model("Item")
,   Variation = mongoose.model("Variation")
,   ObjectId  = mongoose.Types.ObjectId;

let imageExtensionReg = new RegExp(/.+\.(gif|jpe?g|png)$/i);

/**
 * Uploads images to s3 and updates the image field.
 *
 * @param {Object} item - mongoose item object.
 * @param {Array} images - image names.
 * 
 * @return {Promise}
 */
function uploadImages(item, images) {
  
  return new Promise((resolve, reject) => {
    
    let _id        = item._id
    ,   promises   = [];
    
    for (let index = 0; index < images.length; index++)
    {
      let imageName = images[index]
      ,   matches   = imageName.match(imageExtensionReg);
      
      // if it matches
      if (matches && matches.length == 2) {
        let imageFile = fs.readFileSync(path.join(__dirname, "../tmp/uploads", imageName));

        let extension = matches[1].toLowerCase()
        ,   newImageName = _id + '_' + index + '.' + extension;

        promises.push(
          S3.uploadImage(newImageName, imageFile).then((imageUrl) => {
            return {
              name: newImageName,
              url: imageUrl
            };
          })
        );
      }
    }
    
    Promise.all(promises).then((images) => {
      // stores the images
      item.images = images;
      
      // save the item with images added
      item.save()
        .then(resolve)
        .catch(reject);
        
    }).catch(reject);
    
  });
  
}

/**
 * Removes all given images from s3.
 *
 * @param {Array} images the images to be removed
 * 
 * @return {Promise}
 */
function removeImages(images) {

  return new Promise((resolve, reject) => {
    
    let promises = [];
    
    for (let image of images)
    {
      promises.push(
        S3.removeImage(image.url)
      );
    }
    
    Promise.all(promises)
      .then(resolve)
      .catch(reject);
    
  });
  
}

/**
 * Removes local image cache specified by image names.
 *
 * @param {Array}
 */
function removeImageCache(images) {
  for (let index = 0; index < images.length; index++)
  {
    let imageName = images[index];
    
    fs.unlinkSync(path.join(__dirname, "../tmp/uploads", imageName));
  }
}

let ItemApi = {
  
  /**
   * Creates a new item.
   * 
   * @param  {Object} rawData the raw data containing the new item info.
   *
   * @return {Promise}
   */
   add: function(rawData) {
     
     return new Promise((resolve, reject) => {
       
       // extract the image field
       let images = rawData.image;
       delete rawData.image;
       
       let item = new Item(rawData);

       item.save(function(err, newItem) {
         if (err) {
           reject(err);
         } else {
           uploadImages(item, images).then((updatedItem) => {
            // we handle this on front end
            //  removeImageCache(images);
             
             resolve(updatedItem);
           }).catch(reject);
         }
       });
       
     });

   },
   
   /**
    * Removes item specified by given id, if it exists.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise}
    */
   remove: function(id) {
     
     return new Promise((resolve, reject) => {
       
       Item.findById(ObjectId(id))
        .then((item) => {
          let images = item.images;
          
          // remove images stored on s3, all variations associated with this item
          // and this item
          return Promise.all([
            removeImages(images),
            Variation.remove({item: ObjectId(id)}),
            Item.remove({_id: ObjectId(id)})
          ]);
          
        })
        .then(resolve)
        .catch(reject);

     });
     
   },
   
   /**
    * Updates item specified by given id with new value.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise}
    */
   update: function(id, newValue) {

     return new Promise((resolve, reject) => {
       
       Item.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true})
        .then(resolve)
        .catch(reject);
       
     });
     
   },
   
   /**
    * Returns item specified by given id, if it exists.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise}
    */
   get: function(id) {
     
     return new Promise((resolve, reject) => {
       
       Item.findById(ObjectId(id))
        .then(resolve)
        .catch(reject);
       
     });
     
   },
   
   /**
    * Returns all items with given limit.
    *
    * @param {Number} skip the number of records to skip.
    * @param {Number} limit the limit of items to return.
    * @param {Object} query the query for getting items.
    * 
    * @return {Promise}
    */
   getAll: function(skip, limit, query) {
     
     skip = skip || 0;
     // make it 100 for item manage app
     limit = limit || 100;
     
     query = query || {};
     
     return new Promise((resolve, reject) => {
       
       Item.find(query)
         .skip(skip)
         .limit(limit)
         .populate("brand category tags variations")
         .exec()
         .then(resolve)
         .catch(reject);
       
     });
     
   }
};

module.exports = ItemApi;