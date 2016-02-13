"use strict"

import React from "react"
import { Carousel, CarouselItem } from "react-bootstrap"

export default class BaseCarousel extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = { 
      items: props.items
    };
  }
  
  createCarousel() {
    var carouselItems = [];
    var item;
    
    for (var i = 0; i < this.state.items.length; i++)
    {
      item = this.state.items[i];
      
      carouselItems.push(
        <CarouselItem key={i}>
          <img alt="900x500" src={item.src}/>
          <div className="carousel-caption">
            <h3>{item.label}</h3>
            <p>{item.content}</p>
          </div>
        </CarouselItem>
      );
    }
    
    return (
      <Carousel>
        {carouselItems}
      </Carousel>
    );
  }
  
  render() {
    var carousel;
    var style;
    
    carousel = this.createCarousel();
    
    style = {
      height: this.props.height + "px"
    };
    
    return (
      <div>
        {carousel}
      </div>
    );
  }
}

BaseCarousel.propTypes = { 
  items: React.PropTypes.array.isRequired,
  height: React.PropTypes.number
};

BaseCarousel.defaultProps = { 
  items: [],
  height: 700
};