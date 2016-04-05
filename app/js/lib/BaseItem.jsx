"use strict"

import React from "react"
import CSSModules from "react-css-modules"
import { Thumbnail, Button } from "react-bootstrap"

import styles from "./BaseItem.css"

function createPrice(price) {
  if (price) {
    return price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
}

class BaseItem extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      imageLoaded: false,
      bannerOpacity: 0
    };
  }
  
  onImageLoad() {
    return;
    
    if (this.state.imageLoaded) {
      return;
    }
    
    this.setState({
      imageLoaded: true
    });
  }
  
  createImageJsx() {
    let item     = this.props.item
    ,   imageUrl = "http://d2nl38chx1zeob.cloudfront.net/" + item.images[0].name;
    
    let imgStyle = {
      maxWidth: "100%",
      maxHeight: "100%"
    };
    
    return (
      <img style={imgStyle} src={imageUrl} />
    );
  }
  
  createBannerJsx() {
    let item = this.props.item
    ,   bannerStyle;
    
    bannerStyle = {
      opacity: this.state.bannerOpacity
    };
    
    return (
      <div style={bannerStyle} styleName="baseBanner">
        <div styleName="itemName">{item.name}</div>
        <div styleName="itemPrice">{createPrice(item.feature.price)}</div>
      </div>      
    );
  }
  
  handleMouseEnter() {
    this.setState({
      bannerOpacity: 1
    });
  }
  
  handleMouseLeave() {
    this.setState({
      bannerOpacity: 0
    });
  }
  
  handleClick() {
    this.props.handleItemClick(this.props.item);
  }
  
  render() {
    let itemJsx
    ,   bannerJsx;
    
    itemJsx = this.createImageJsx();
    
    bannerJsx = this.createBannerJsx();
    
    return (
      <div styleName="baseItem" 
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={this.handleClick.bind(this)}>
        {itemJsx}
        {bannerJsx}
      </div>
    );
    
  }
}

BaseItem.propTypes = { 
  item: React.PropTypes.object.isRequired,
  handleItemClick: React.PropTypes.func
};

BaseItem.defaultProps = { 
  item: {},
  handleItemClick: function() {}
};

export default CSSModules(BaseItem, styles)