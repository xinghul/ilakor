"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import Dropzone from "dropzone"
import request from "superagent-bluebird-promise"

import dropzoneStyles from "dropzone/dist/min/dropzone.min.css"

import styles from "components/ItemManageApp/ImageUploader.scss"

let _files = [];

Dropzone.options.imageUploaderDropzone = {
  acceptedFiles: "image/*",
  addRemoveLinks: true,
  init: function() {
    
    this.on("success", function(file, response) {
      let filename = response.filename;
      
      invariant(!_.isEmpty(filename), "Filename shouldn't be empty.");
      
      // keep track of the filename on server
      file.filename = filename;
      
      _files.push(filename);
    });
    
    this.on("removedfile", function(file){
      let filename = file.filename;
      
      invariant(!_.isEmpty(filename), "Filename shouldn't be empty.");

      // always remove the file
      _.pull(_files, filename);
      
      request.del("/upload")
        .query({filename: filename})
        .then(function(res) {
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    
  }
};

export default class ImageUploader extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  getValue() {
    return _files;
  }
  
  render() {
    
    
    return (
      <form 
        action="/upload"
        className="dropzone"
        id="image-uploader-dropzone">
      </form>    
    );
  }
}
