"use strict";

import React from "react"

export default {
  
  /**
   * Creates the jsx for price span.
   * 
   * @param {String} price the price.
   * 
   * @return {JSX} 
   */
  createPriceJsx: function(price) {
    let style = {
      color: "#a94442",
      
      fontWeight: "600"
    };
    
    return (
      <span style={style}>
        $ {new Number(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
      </span>
    );
  }
};