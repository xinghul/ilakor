"use strict"

import React from "react"
import { Image, Glyphicon } from "react-bootstrap"

import GhostButton from "lib/GhostButton"

import styles from "components/ItemDisplayApp/BaseItem.scss"

import ItemUtil from "utils/ItemUtil"

export default class BaseItem extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      imageLoaded: false,
      bannerBottom: "-80px"
    };
  }
  
  /**
   * @private
   * Handler for when the image is loaded.
   */
  _onImageLoad = () => {
    if (this.state.imageLoaded) {
      return;
    }
    
    this.setState({
      imageLoaded: true
    });
  };
  
  /**
   * @private
   * Handler for when mouse enters the item div.
   */
  _onMouseEnter = () => {
    this.setState({
      bannerBottom: "0px"
    });
  };
  
  /**
   * @private
   * Handler for when mouse leaves the item div.
   */
  _onMouseLeave = () => {
    this.setState({
      bannerBottom: "-80px"
    });
  };
  
  createImageJsx() {
    let item     = this.props.item
    ,   imageUrl = "http://d2nl38chx1zeob.cloudfront.net/" + item.images[0].name;
    
    return (
      <Image className={styles.itemImage} src={imageUrl} onLoad={this._onImageLoad} />
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
        <div className={styles.itemPrice}>{ItemUtil.createPriceJsx(item.price)}</div>
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
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
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
  handleItemClick: React.PropTypes.func
};

BaseItem.defaultProps = { 
  item: {},
  handleItemClick: function() {}
};
