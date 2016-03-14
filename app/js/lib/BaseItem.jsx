"use strict"

import React from "react"
import { Thumbnail, Button } from "react-bootstrap"

export default class BaseItem extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  createItemJsx() {
    let item     = this.props.item
    ,   imageUrl = "http://d2nl38chx1zeob.cloudfront.net/" + item.images[0].name;
    
    return (
      <div>
        <Thumbnail src={imageUrl} />
        <div>
          <div>{item.name}</div>
          <div>{item.weight}</div>
        </div>
      </div>
    );
  }
  
  render() {
    let itemJsx
    ,   style;
    
    itemJsx = this.createItemJsx();
    
    style = {
      height: this.props.height + "px",
      padding: "20px"
    };
    
    return (
      <div>
        {itemJsx}        
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