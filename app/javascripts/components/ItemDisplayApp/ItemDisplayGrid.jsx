"use strict"

import React from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

import styles from "components/ItemDisplayApp/ItemDisplayGrid.scss"

import BaseItem from "./BaseItem"

export default class ItemDisplayGrid extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  createItemJsx(item) {

    let itemJsx;

    itemJsx = (
      <div key={item._id} className={styles.itemContainer}>
        <BaseItem 
          item={item} 
          handleItemClick={this.props.handleItemClick}
          handleAddToCartClick={this.props.handleAddToCartClick} />
      </div>
    );
    
    return itemJsx;
  }

  render() {
    let items    = this.props.items
    ,   itemsJsx = [];

    for (let item of items)
    {
      itemsJsx.push(this.createItemJsx(item));
    }
    
    return (
      <div className={styles.itemDisplayGrid}>
        <ReactCSSTransitionGroup transitionName="item" 
          transitionEnterTimeout={300} 
          transitionLeaveTimeout={300}>
          {itemsJsx}          
        </ReactCSSTransitionGroup>
      </div>
    );
    
  }
}

ItemDisplayGrid.propTypes = { 
  items: React.PropTypes.array,
  handleItemClick: React.PropTypes.func,
  handleAddToCartClick: React.PropTypes.func
};

ItemDisplayGrid.defaultProps = { 
  items: [],
  handleItemClick: function() {},
  handleAddToCartClick: function() {}
};