"use strict";

let fs      = require("fs")
,   path    = require("path")
,   AWS     = require("aws-sdk")
,   Promise = require("bluebird");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  endPoint: "s3.amazonaws.com"
});

let BUCKET_NAME = process.env.S3_BUCKET
,   IMAGE_FOLDER = process.env.S3_IMAGE_FOLDER
,   s3 = new AWS.S3({
  apiVersion: "2006-03-01"
});

let S3Api = {
  
  /**
   * Uploads a image with given name to S3.
   * 
   * @param  {String} imageName the given image name.
   * @param  {Buffer} imageFile the image file buffer.
   * 
   * @return {Promise} the new promise object.
   */
  uploadImage: function(imageName, imageFile) {
    
    return new Promise(function(resolve, reject) {
      
      let imageUrl = IMAGE_FOLDER + '/' + imageName;
      
      let params = {
        Bucket: BUCKET_NAME,
        Key: imageUrl, 
        Body: imageFile
      };
      
      s3.upload(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(imageUrl);
        }
      });
      
    });

  },
  
  /**
   * Removes a image with given url on S3.
   * 
   * @param  {String} imageUrl the given image url.
   * 
   * @return {Promise} the new promise object.
   */
  removeImage: function(imageUrl) {
    return new Promise(function(resolve, reject) {
      let params = {
        Bucket: BUCKET_NAME,
        Key: imageUrl
      };
      
      s3.deleteObject(params, function(err, data) {
        if (err){
          reject(err);
        } else {
          resolve(data);
        }        
      });
    });
  }

};

module.exports = S3Api;