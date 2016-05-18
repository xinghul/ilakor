"use strict"

import React from "react"
import CSSModules from "react-css-modules"

import styles from "./MultiSelectInput.css"

class MultiSelectInput extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div>
        <div>
        </div>
        <div>
        </div>
      </div>
      
    );
  }
};

MultiSelectInput.propTypes = {
  options: React.PropTypes.array.isRequired
};

export default CSSModules(MultiSelectInput, styles, { allowMultiple: true })