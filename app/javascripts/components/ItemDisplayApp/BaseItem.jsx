import React from "react";
import _ from "lodash";
import { Image, Glyphicon } from "react-bootstrap";
import Numeral from "numeral";

import GhostButton from "lib/GhostButton";

import styles from "components/ItemDisplayApp/BaseItem.scss";

const categoryToColor = {
  "protein": "#cb3837",
  "pre workout": "#f09233",
  "post workout": "#2a79a7",
  "creatine": "#00a79d"
};

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
      outOfStock: false,
      
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
    
    let itemPrice = Number.MAX_SAFE_INTEGER
    ,   outOfStock = false;
    
    _.forEach(variations, (variation) => {
      if (!variation.outOfStock && variation.price < itemPrice) {
        itemPrice = variation.price;
      }
    });
    
    if (itemPrice === Number.MAX_SAFE_INTEGER) {
      itemPrice = 0;
      outOfStock = true;
    }

    this.setState({
      itemPrice,
      outOfStock
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
    const { itemPrice, outOfStock } = this.state;
    
    let bannerStyle = {
      bottom: this.state.bannerBottom
    };
    
    return (
      <div style={bannerStyle} className={styles.baseBanner}>
        <div className={styles.itemName}>{_.capitalize(item.name)}</div>
        {do {
          if (outOfStock) {
            <div className={styles.itemPrice}>out of stock</div>;
          } else {
            <div className={styles.itemPrice}>from <span className={styles.price}>{Numeral(itemPrice).format("$0,0.00")}</span></div>;
          }
        }}
        
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
    
    const { outOfStock } = this.state;
    
    // if it's out of stock, do nothing
    if (outOfStock) {
      return;
    }
    
    this.props.handleItemClick(this.props.item);
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { item } = this.props;

    let style = {
      borderTopColor: categoryToColor[item.category.name] || "gray"
    };

    return (
      <div style={style} 
        className={styles.baseItem} 
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
  handleItemClick: () => {}
};
