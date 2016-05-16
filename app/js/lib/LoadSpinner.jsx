"use strict"

import React from "react"
import CSSModules from "react-css-modules"

import styles from "./LoadSpinner.css"

class Loader extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props}>
        <div styleName="loader">
          <div styleName="inner one"></div>
          <div styleName="inner two"></div>
          <div styleName="inner three"></div>
        </div>
        <div styleName="loaderText">LOADING</div>
      </div>
      
    );
  }
};

export default CSSModules(Loader, styles, { allowMultiple: true })