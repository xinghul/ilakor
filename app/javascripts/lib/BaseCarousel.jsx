"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { Carousel, Image } from "react-bootstrap"

import styles from "lib/BaseCarousel.scss"

/**
 * @private
 * Creates the carousel items for the carousel.
 * 
 * @param  {String[]} images the src for each carousel item.
 * @param  {String} title the title for each carousel item.
 * 
 * @return {JSX}
 */
function renderCarouselItems(images, title) {
  
  return images.map((image, index) => {
    
    return (
      <Carousel.Item className={styles.carouselItem} key={index}>
        <img className={styles.carouselItemImage} alt={title} src={image} />
        <Carousel.Caption>
          <h3>{title}</h3>
        </Carousel.Caption>
      </Carousel.Item>
    );
  });
  
}

/**
 * @extends React.Component
 */
export default class BaseCarousel extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      index: 0,
      direction: null
    };
  }
  
  /**
   * @private
   * Handler for the controls being selected.
   * 
   * @param  {Number} selectedIndex the selected index.
   * @param  {Object} e the event object containing the direction.
   */
  handleSelect = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    let style = {
      width: this.props.width + "px",
      height: this.props.height + "px"
    };
    
    return (
      <Carousel 
        className={styles.baseCarousel} 
        activeIndex={this.state.index} 
        direction={this.state.direction} 
        onSelect={this.handleSelect}
        style={style}
      >
        {renderCarouselItems(this.props.images, this.props.title)}
      </Carousel>
    );
  }
}

BaseCarousel.propTypes = {
  images: React.PropTypes.arrayOf(React.PropTypes.string),
  title: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number
};

BaseCarousel.defaultProps = {
  images: [
    "/images/items/kitchen1.jpg",
    "/images/items/kitchen2.jpg",
    "/images/items/kitchen3.jpg",
    "/images/items/kitchen4.jpg",
    "/images/items/kitchen5.jpg"
  ],
  title: "Kitchen sample",
  width: 300,
  height: 300
};