"use strict"

import React from "react"
import { Thumbnail, Button } from "react-bootstrap"

export default class BaseItem extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = { 
      item: props.item
    };
  }
  
  createItem() {
    var itemConfig = this.state.item;
    
    return (
      <div>
        <Thumbnail src={itemConfig.src} href={itemConfig.href} alt={itemConfig.alt} />
        <div>
          <h3>{itemConfig.label}</h3>
          <p>{itemConfig.description}</p>
        </div>
      </div>
    );
  }
  
  render() {
    var item;
    var style;
    
    item = this.createItem();
    
    style = {
      height: this.props.height + "px"
    };
    
    return (
      <div>
        {item}        
      </div>
    );
    
  }
}

BaseItem.propTypes = { 
  item: React.PropTypes.object.isRequired,
  height: React.PropTypes.number
};

BaseItem.defaultProps = { 
  item: {},
  height: 700
};