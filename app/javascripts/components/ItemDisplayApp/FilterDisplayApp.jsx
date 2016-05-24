"use strict"

import React from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Button, Glyphicon, Grid } from "react-bootstrap"

import styles from "components/ItemDisplayApp/FilterDisplayApp.scss"

export default class FilterDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  removeFilter = (filterType, filterValue) => {
    this.props.handleRemoveFilter(filterType, filterValue);
  };
  
  createJsxFilterItems() {
    let filters = this.props.filters
    ,   jsxFilterItems = [];
    
    for (let filterType of Object.keys(filters))
    {
      let filterValue = filters[filterType];
      
      jsxFilterItems.push(
        <div key={filterType} className={styles.filterItem}>
          <div className={styles.filterItemInfo}>
            {filterType}:{filterValue}
          </div>
          <Button 
            onClick={this.removeFilter.bind(this, filterType, filterValue)} 
            bsSize="small" className={styles.filterItemRemove}>
            <Glyphicon glyph="remove" />  
          </Button>
        </div>
        
      );
    }
    
    return jsxFilterItems;
  }
  
  render() {
    
    let jsxFilterItems = this.createJsxFilterItems();
    
    return (
      <div fluid className={styles.filterDisplayApp}>
        <ReactCSSTransitionGroup transitionName="filter" 
          transitionEnterTimeout={300} 
          transitionLeaveTimeout={300}>
          {jsxFilterItems}
        </ReactCSSTransitionGroup>
      </div>
    );
    
  }
}

FilterDisplayApp.propTypes = { 
  filters: React.PropTypes.object,
  handleRemoveFilter: React.PropTypes.func
};

FilterDisplayApp.defaultProps = { 
  filters: {},
  handleRemoveFilter: function() {}
};
