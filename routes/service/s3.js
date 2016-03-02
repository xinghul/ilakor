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

let bucketName      = process.env.S3_BUCKET
,   imageFolderName = process.env.S3_IMAGE_FOLDER;

let S3Api = {
  
  /**
   * Uploads a image with given name to S3.
   * 
   * @param  {String} imageName the given image name.
   * @param  {Object} imageFile the image file.
   * 
   * @return {Promise} the new promise object.
   */
  uploadImage: function(imageName, imageFile) {
    
    return new Promise(function(resolve, reject) {
      
      let imagePath = imageFile.path;
      
      fs.readFile(imagePath, function(err, data) {
        
        if (err) {
          reject(err);
        } else {
          let s3bucket = new AWS.S3({params: {Bucket: bucketName}})
          ,   imageUrl = imageFolderName + '/' + imageName;
          
          s3bucket.createBucket(function() {
            let params = {Key: imageUrl, Body: data};
            s3bucket.upload(params, function(err, data) {
              if (err) {
                reject(err);
              } else {
                // delete the tmp file when upload succeeded
                // use retry approach later
                fs.unlink(imagePath, function() {
                  resolve(imageUrl);
                });
              }
            });
          });
          
        }
        
      });
      
    });

  },
  
  /**
   * Signs an image and returns the signed url.
   * 
   * @param  {String} imageUrl the image url on s3.
   * 
   * @return {Promise} the new promise object.
   */
  signImage: function(imageUrl) {
    
    return new Promise(function(resolve, reject) {
      
      var s3 = new AWS.S3();
      var params = {Bucket: bucketName, Key: imageUrl};
      
      s3.getSignedUrl("getObject", params, function(err, signedUrl) {
        if (err) {
          reject(err);
        } else {
          resolve(signedUrl);          
        }
      });
      
    });
    
  },
  
  /**
   * Signs an array of images and returns the signed urls.
   * 
   * @param  {[String]} imageUrls the array of image urls on s3.
   * 
   * @return {Promise} the new promise object.
   */
  signImages: function(imageUrls) {
    
    return new Promise(function(resolve, reject) {
      
      let promises = [];
      
      for (let imageUrl of imageUrls)
      {
        promises.push(
          S3Api.signImage(imageUrl)
        );
      }
      
      Promise.all(promises).then(function(signedUrls) {
        resolve(signedUrls);
      }).catch(function(err) {
        reject(err);
      });
      
    });
    
  }

};

module.exports = S3Api;