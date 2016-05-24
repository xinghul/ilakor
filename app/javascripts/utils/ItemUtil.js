"use strict";

import React from "react"

export default {
  createPriceJsx: function(price) {
    let style = {
      color: "#E5615E",
      
      fontWeight: "600"
    };
    
    return (
      <span style={style}>
        $ {new Number(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
      </span>
    );
  }
};