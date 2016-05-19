"use strict"

import React from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import CSSModules from "react-css-modules"
import { Button, Glyphicon, Grid } from "react-bootstrap"

import styles from "./FilterDisplayApp.css"

class FilterDisplayApp extends React.Component {
  
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
        <div key={filterType} styleName="filter-item">
          <div styleName="filter-item-info">
            {filterType}:{filterValue}
          </div>
          <Button 
            onClick={this.removeFilter.bind(this, filterType, filterValue)} 
            bsSize="small" styleName="filter-item-remove">
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
      <div fluid styleName="filter-display-app">
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

export default CSSModules(FilterDisplayApp, styles)