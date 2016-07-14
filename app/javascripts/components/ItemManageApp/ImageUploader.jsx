"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import Dropzone from "dropzone"
import request from "superagent-bluebird-promise"

import { Image } from "react-bootstrap"

import dropzoneStyles from "dropzone/dist/min/dropzone.min.css"

import styles from "components/ItemManageApp/ImageUploader.scss"

Dropzone.autoDiscover = false;

let dropzoneConfig = {
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

let _files = []
,   _dropzone;

export default class ImageUploader extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);  
    
    this._dropzoneId = _.uniqueId("dropzone");
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    _dropzone = new Dropzone(`#${this._dropzoneId}`, dropzoneConfig);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    _dropzone.destroy();
  }
  
  /**
   * Returns the uploaded files.
   */
  getValue() {
    return _files;
  }
  
  /**
   * Resets the image uploader state.
   */
  clear() {
    _files = [];
    
    _dropzone.removeAllFiles();
  }

  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.imageUploader}>
        <form 
          action="/upload"
          className="dropzone"
          id={this._dropzoneId}
        >
        <div className="dz-message">
          <Image className={styles.uploadIcon} src="/images/upload-icon.png" />
          <div>
            Drop or browse images to attach
          </div>
        </div>
        </form>
      </div> 
    );
  }
}
