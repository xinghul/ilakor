import React from "react";
import { Cell } from "fixed-data-table";

import Icon from "lib/Icon";

import styles from "lib/DataTable/Cell/SortableHeaderCell.scss";

import SortTypes from "../SortTypes";

/**
 * Returns the reversed sort direction.
 * 
 * @param  {String} sortDir the current sort direction.
 * 
 * @return {String}        
 */
function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

/**
 * @class
 * @extends {React.Component}
 */
export default class SortableHeaderCell extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @private
   * Event handler for when the cell is clicked.
   * 
   * @param  {Object} e the event object.
   */
  _onSortChange = (e) => {
    e.preventDefault();
    
    const { ...props } = this.props;

    props.onSortChange(
      props.columnKey,
      props.sortDir ?
        reverseSortDirection(props.sortDir) :
        SortTypes.DESC
    );
  };

  /**
   * @inheritdoc
   */
  render() {
    
    const { sortDir, children, onSortChange, ...props } = this.props;
    
    let iconName = !_.isEmpty(sortDir) ? (sortDir === SortTypes.DESC ? "arrow-down" : "arrow-up") : ''
    ,   sortIcon = do {
      if (_.isEmpty(iconName)) {
        null;
      } else {
        <Icon className={styles.sortIcon} name={iconName} />
      }
    }

    return (
      <Cell {...props} onClick={this._onSortChange} >
        {children} {sortIcon}
      </Cell>
    );
  }
}

SortableHeaderCell.propTypes = {
  onSortChange: React.PropTypes.func.isRequired
};