"use strict"

import React from "react"

import styles from "./LoadSpinner.css"

export default class Loader extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div className="load-spinner" {...this.props}>
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
        <div className="loader-text">LOADING</div>
      </div>
      
    );
  }
}
