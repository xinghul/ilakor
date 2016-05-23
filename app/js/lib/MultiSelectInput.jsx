"use strict"

import React from "react"

import styles from "./MultiSelectInput.css"

export default class MultiSelectInput extends React.Component {
  
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
}

MultiSelectInput.propTypes = {
  options: React.PropTypes.array.isRequired
};
