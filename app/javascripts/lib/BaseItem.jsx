"use strict"

import React from "react"
import { Thumbnail, Image, Button, Glyphicon } from "react-bootstrap"

import styles from "lib/BaseItem.scss"

import ItemUtil from "utils/ItemUtil"

export default class BaseItem extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      imageLoaded: false,
      bannerBottom: "-80px"
    };
  }
  
  handleImageLoaded = () => {
    if (this.state.imageLoaded) {
      return;
    }
    
    this.setState({
      imageLoaded: true
    });
  };
  
  createImageJsx() {
    let item     = this.props.item
    ,   imageUrl = "http://d2nl38chx1zeob.cloudfront.net/" + item.images[0].name;
    
    return (
      <Image className={styles.itemImage} src={imageUrl} onLoad={this.handleImageLoaded} />
    );
  }
  
  createBannerJsx() {
    let item = this.props.item
    ,   bannerStyle;
    
    bannerStyle = {
      bottom: this.state.bannerBottom
    };
    
    return (
      <div style={bannerStyle} className={styles.baseBanner}>
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.cartIcon} onClick={this.handleAddToCartClick}>
          <Button bsStyle="warning" bsSize="xsmall">
            <Glyphicon glyph="shopping-cart" />
            Add to cart
          </Button>
        </div>
        <div className={styles.itemPrice}>{ItemUtil.createPriceJsx(item.feature.price)}</div>
      </div>      
    );
  }
  
  createLoadSpinnerJsx() {
    let style = {
      display: this.state.imageLoaded ? "none" : "block"
    };
    
    return (
      <div className={styles.loaderWrapper} style={style}>
        <div className={styles.loader}></div>
      </div>
      
    );
  }
  
  handleMouseEnter = () => {
    this.setState({
      bannerBottom: "0px"
    });
  };
  
  handleMouseLeave = () => {
    this.setState({
      bannerBottom: "-80px"
    });
  };
  
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
    ,   loadSpinnerJsx
    ,   style;
    
    itemJsx = this.createImageJsx();
    
    bannerJsx = this.createBannerJsx();
    
    loadSpinnerJsx = this.createLoadSpinnerJsx();
    
    return (
      <div className={styles.baseItem} 
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleItemClick}>
        {itemJsx}
        {bannerJsx}
        {loadSpinnerJsx}
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
