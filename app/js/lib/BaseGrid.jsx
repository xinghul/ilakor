"use strict"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"
import { Carousel, CarouselItem } from "react-bootstrap"

import BaseCarousel from "./BaseCarousel.jsx"
import BaseItem from "./BaseItem.jsx"

export default class BaseGrid extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = { 
      itemsConfig: props.itemsConfig,
      items: []
    };
  }
  
  componentDidMount() {
    let itemsConfig = this.state.itemsConfig
    ,   items = [];
    
    for (let itemConfig of itemsConfig)
    {
      switch (itemConfig.type) {
        
        case "carousel":
          items.push(this.createCarousel(itemConfig.items));
          
          break;
          
        case "item":
          items.push(this.createItem(itemConfig));
          
          break;
          
        default: 
          break;
      }
    }

    this.setState({
      items: items
    });
  }
  
  createItem(itemConfig) {
    let itemJsx;

    itemJsx = (
      <Col xs={6} md={4}>
        <BaseItem item={itemConfig} />
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
    
    return (
      <Grid fluid>
        <Row>
          {this.state.items}          
        </Row>
      </Grid>
    );
    
  }
}

BaseGrid.propTypes = { 
  itemsConfig: React.PropTypes.array
};

BaseGrid.defaultProps = { 
  itemsConfig: []
};