"use strict"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"
import { Carousel, CarouselItem } from "react-bootstrap"

import BaseCarousel from "./BaseCarousel.jsx"
import BaseItem from "./BaseItem.jsx"

export default class BaseGrid extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  createItemJsx(item) {
    let itemJsx;

    itemJsx = (
      <Col xs={4} md={3}>
        <BaseItem item={item} />
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
      <Grid fluid>
        <Row>
          {itemsJsx}          
        </Row>
      </Grid>
    );
    
  }
}

BaseGrid.propTypes = { 
  items: React.PropTypes.array
};

BaseGrid.defaultProps = { 
  items: []
};