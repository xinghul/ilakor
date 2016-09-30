import _ from "lodash";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import styles from "components/ItemDisplayApp/ItemDisplayGrid.scss";

import BaseItem from "./BaseItem";

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemDisplayGrid extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * Creates the JSX for each BaseItem.
   * 
   * @return {JSX}
   */
  _createItemJsx(item) {

    let itemJsx;

    itemJsx = (
      <div key={item._id} className={styles.itemContainer}>
        <BaseItem 
          item={item} 
          handleItemClick={this.props.handleItemClick}
        />
      </div>
    );
    
    return itemJsx;
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { items } = this.props;
    
    let itemsJsx = _.map(items, (item) => {
      return this._createItemJsx(item);
    });
    
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
  handleItemClick: React.PropTypes.func
};

ItemDisplayGrid.defaultProps = { 
  items: [],
  handleItemClick: function() {}
};