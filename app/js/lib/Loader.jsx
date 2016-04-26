"use strict"

import React from "react"
import CSSModules from "react-css-modules"

import styles from "./Loader.css"

class Loader extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props}>
        <div styleName="loader"></div>
        <div styleName="loaderText">LOADING</div>
      </div>
      
    );
  }
}

export default CSSModules(Loader, styles)