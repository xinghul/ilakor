"use strict"

import React from "react"
import { Dropdown, MenuItem } from "react-bootstrap"
import _ from "lodash"

import Icon from "lib/Icon"
import Checkbox from "lib/Checkbox"

import styles from "lib/DataTable/TableColumnConfig.scss"

class DropdownToggle extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @private
   * Event handler for div's 'click' event.
   * 
   * @param  {Object} e the event object.
   */
  _onClick = (e) => {
    e.preventDefault();

    this.props.onClick(e);
  }

  /**
   * @inheritdoc
   */
  render() {
    
    return (
      <div className={styles.dropdownToggle} onClick={this._onClick}>
        {this.props.children}
        <Icon className={styles.toggleChevron} name="chevron-down" />
      </div>
    );
    
  }
}

class DropdownMenu extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }

  /**
   * @inheritdoc
   */
  render() {
    const { children } = this.props;

    return (
      <div className="dropdown-menu">
        {children}
      </div>
    );
  }
}

export default class TableColumnConfig extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this._id = _.uniqueId("dataTableColumnConfig");
  }
  
  /**
   * @private
   * Event handler for checkbox's 'change' event.
   * 
   * @param  {String} columnKey the specific column key.
   * @param  {Boolean} checked  the checked value.
   */
  _onCheckboxChange = (columnKey, checked) => {
    this.props.onShowColumnChange(columnKey, checked);
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { columnKeys, showColumn, columnKeyToHeader, onShowColumnChange } = this.props;
    
    if (_.isEmpty(columnKeys)) {
      return null;
    }
        
    return (
      <div className={styles.tableColumnConfig}>
        <Dropdown id={this._id}>
          <DropdownToggle bsRole="toggle">
            Columns
          </DropdownToggle>

          <DropdownMenu bsRole="menu">
            {columnKeys.map((columnKey, index) => {
              
              if (_.isUndefined(columnKeyToHeader[columnKey])) {
                return null;
              }
              
              return (
                <Checkbox 
                  key={columnKey}
                  checked={showColumn[columnKey]}
                  onChange={this._onCheckboxChange.bind(null, columnKey)}
                >
                  {columnKeyToHeader[columnKey]}
                </Checkbox>
              );
              
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

TableColumnConfig.propTypes = {
  columnKeys: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  showColumn: React.PropTypes.object.isRequired,
  columnKeyToHeader: React.PropTypes.object.isRequired,
  onShowColumnChange: React.PropTypes.func.isRequired
};