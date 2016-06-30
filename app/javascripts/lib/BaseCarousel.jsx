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
 * @param  {Object[]} images the src for each carousel item.
 * @param  {String} title the title for each carousel item.
 * 
 * @return {JSX} the JSX created.
 */
function renderCarouselItems(images, title) {
  
  return images.map((image, index) => {
    
    return (
      <Carousel.Item className={styles.carouselItem} key={index}>
        <img className={styles.carouselItemImage} alt="900x500" src={image.src} 
        />
        <Carousel.Caption>
          <h3>{title}</h3>
          <p>{image.description}</p>
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
      width: this.props.width,
      height: this.props.height
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
  images: React.PropTypes.arrayOf(React.PropTypes.shape({
    src: React.PropTypes.string.isRequired,
    description: React.PropTypes.string
  })),
  title: React.PropTypes.string,
  width: React.PropTypes.string,
  height: React.PropTypes.string
};

BaseCarousel.defaultProps = {
  images: [
    {
      src: "/images/items/kitchen1.jpg",
      description: "This is the first image."
    },
    {
      src: "/images/items/kitchen2.jpg",
      description: "This is the second image."
    },
    {
      src: "/images/items/kitchen3.jpg",
      description: "This is the third image."
    },
    {
      src: "/images/items/kitchen4.jpg",
      description: "This is the fourth image."
    },
    {
      src: "/images/items/kitchen5.jpg",
      description: "This is the fifth image."
    }
  ],
  title: "Kitchen sample",
  width: "300px",
  height: "300px"
};