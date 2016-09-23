import React from "react";
import { Image, Glyphicon } from "react-bootstrap";

import GhostButton from "lib/GhostButton";

import styles from "components/ItemDisplayApp/BaseItem.scss";

import ItemUtil from "utils/ItemUtil";

/**
 * @class
 * @extends {React.Component}
 */
export default class BaseItem extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      itemPrice: 0,
      imageLoaded: false,
      bannerBottom: "-80px"
    };
  }
  
  /**
   * @inheritdoc
   */
  componentWillReceiveProps(props) {
    
    const { variations } = props.item;
    
    let itemPrice = Number.MAX_SAFE_INTEGER;
    
    _.forEach(variations, (variation) => {
      if (variation.price < itemPrice) {
        itemPrice = variation.price;
      }
    });    
    console.log(itemPrice);

    this.setState({
      itemPrice
    });
    
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
  
  /**
   * @private
   * Creates the JSX for the item image.
   * 
   * @return {JSX}        
   */
  _createImageJsx() {
    const { item } = this.props;
    
    let imageUrl = "http://d16knxx0wtupz9.cloudfront.net/" + item.images[0].name;
    
    return (
      <Image className={styles.itemImage} src={imageUrl} onLoad={this._onImageLoad} />
    );
  }
  
  /**
   * @private
   * Creates the JSX for banner.
   * 
   * @return {JSX}        
   */
  _createBannerJsx() {
    const { item } = this.props;
    const { itemPrice } = this.state;
    
    let bannerStyle = {
      bottom: this.state.bannerBottom
    };
    
    return (
      <div style={bannerStyle} className={styles.baseBanner}>
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.itemPrice}>{ItemUtil.createPriceJsx(itemPrice)}</div>
      </div>      
    );
  }
  
  /**
   * @private
   * Creates the JSX for the load spinner.
   * 
   * @return {JSX}        
   */
  _createLoadSpinnerJsx() {
    let style = {
      display: this.state.imageLoaded ? "none" : "block"
    };
    
    return (
      <div className={styles.loaderWrapper} style={style}>
        <div className={styles.loader}></div>
      </div>
      
    );
  }
  
  /**
   * @private
   * Handler for when the item is clicked.
   */
  _onItemClick = () => {
    this.props.handleItemClick(this.props.item);
  };
  
  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.baseItem} 
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        onClick={this._onItemClick}>
        {this._createImageJsx()}
        {this._createBannerJsx()}
        {this._createLoadSpinnerJsx()}
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
