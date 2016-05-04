"use strict"

import React from "react"
import CSSModules from "react-css-modules"
import { Thumbnail, Button, Glyphicon } from "react-bootstrap"

import GhostButton from "lib/GhostButton.jsx"

import styles from "./BaseItem.css"

import ItemUtil from "utils/ItemUtil"

class BaseItem extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    
    this.state = {
      imageLoaded: false,
      bannerBottom: "-80px"
    };
  }
  
  handleImageLoaded() {
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
      <img style={imgStyle} src={imageUrl} onLoad={this.handleImageLoaded} />
    );
  }
  
  createBannerJsx() {
    let item = this.props.item
    ,   bannerStyle;
    
    bannerStyle = {
      bottom: this.state.bannerBottom
    };
    
    return (
      <div style={bannerStyle} styleName="baseBanner">
        <div styleName="itemName">{item.name}</div>
        <div styleName="cartIcon" onClick={this.handleAddToCartClick}>
          <GhostButton color="grey" bsSize="xsmall">
            <Glyphicon glyph="shopping-cart" />
            Add to cart
          </GhostButton>
        </div>
        <div styleName="itemPrice">{ItemUtil.createPriceJsx(item.feature.price)}</div>
      </div>      
    );
  }
  
  handleMouseEnter() {
    this.setState({
      bannerBottom: "0px"
    });
  }
  
  handleMouseLeave() {
    this.setState({
      bannerBottom: "-80px"
    });
  }
  
  handleAddToCartClick = (evt) => {
    evt.preventDefault();
    
    evt.stopPropagation();
    
    this.props.handleAddToCartClick(this.props.item);
  };
  
  handleItemClick = () => {
    this.props.handleItemClick(this.props.item);
  };
  
  render() {
    let itemJsx
    ,   bannerJsx
    ,   style;
    
    itemJsx = this.createImageJsx();
    
    bannerJsx = this.createBannerJsx();
    
    style = {
      display: this.state.imageLoaded ? "block" : "none"
    };
    
    return (
      <div styleName="baseItem" 
        style={style}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={this.handleItemClick}>
        {itemJsx}
        {bannerJsx}
      </div>
    );
    
  }
}

BaseItem.propTypes = { 
  item: React.PropTypes.object.isRequired,
  handleItemClick: React.PropTypes.func,
  handleAddToCartClick: React.PropTypes.func
};

BaseItem.defaultProps = { 
  item: {},
  handleItemClick: function() {},
  handleAddToCartClick: function() {}
};

export default CSSModules(BaseItem, styles)