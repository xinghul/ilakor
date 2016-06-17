"use strict"

import React from "react"
import Coverflow from "react-coverflow"

import styles from "lib/BaseCarousel.scss"

export default class BaseCarousel extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  
  render() {
    return (
      <Coverflow width="960" height="500"
        displayQuantityOfSide={2}
        navigation={false}
        enableScroll={true}
      >
        <img src="images/items/kitchen1.jpg" />
        <img src="images/items/kitchen2.jpg" />
        <img src="images/items/kitchen3.jpg" />
        <img src="images/items/kitchen4.jpg" />
        <img src="images/items/kitchen5.jpg" />
      </Coverflow>
    );
  }
}

BaseCarousel.propTypes = {
};

BaseCarousel.defaultProps = {
};