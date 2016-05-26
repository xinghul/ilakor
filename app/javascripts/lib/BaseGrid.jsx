"use strict"

import React from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Grid, Row, Col } from "react-bootstrap"
import { Carousel, CarouselItem } from "react-bootstrap"

import styles from "lib/BaseGrid.scss"

import BaseCarousel from "./BaseCarousel.jsx"
import BaseItem from "./BaseItem.jsx"

export default class BaseGrid extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  createItemJsx(item) {

    let itemJsx;

    itemJsx = (
      <Col xs={4} md={3} key={item._id}>
        <BaseItem 
          item={item} 
          handleItemClick={this.props.handleItemClick}
          handleAddToCartClick={this.props.handleAddToCartClick} />
      </Col>
    );
    
    return itemJsx;
  }

  createCarousel(carouselConfig) {
    var itemJsx;
    
    if (!Array.isArray(carouselConfig))
    {
      return;
    }

    itemJsx = (
      <Col xs={12} md={8}>
        <BaseCarousel items={carouselConfig} />
      </Col>
    );
    
    return itemJsx;
  }
  
  render() {
    let items    = this.props.items
    ,   itemsJsx = [];

    for (let item of items)
    {
      itemsJsx.push(this.createItemJsx(item));
    }
    
    return (
      <Grid fluid className={styles.baseGrid}>
        <Row>
          <ReactCSSTransitionGroup transitionName="item" 
            transitionEnterTimeout={300} 
            transitionLeaveTimeout={300}>
            {itemsJsx}          
          </ReactCSSTransitionGroup>
        </Row>
      </Grid>
    );
    
  }
}

BaseGrid.propTypes = { 
  items: React.PropTypes.array,
  handleItemClick: React.PropTypes.func,
  handleAddToCartClick: React.PropTypes.func
};

BaseGrid.defaultProps = { 
  items: [],
  handleItemClick: function() {},
  handleAddToCartClick: function() {}
};