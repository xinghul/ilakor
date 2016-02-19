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
    let itemConfig = this.state.item;
    
    
    return (
      <div>
        <Thumbnail src={itemConfig.src} href={itemConfig.href} alt={itemConfig.alt} />
        <div>
          <div>{itemConfig.label}</div>
          <div>{itemConfig.description}</div>
        </div>
      </div>
    );
  }
  
  render() {
    let item
    ,   style;
    
    item = this.createItem();
    
    style = {
      height: this.props.height + "px",
      padding: "20px"
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
  height: 300
};