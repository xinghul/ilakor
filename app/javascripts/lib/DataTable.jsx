"use strict"

import React from "react"
import { Table, Column, Cell } from "fixed-data-table"
import _ from "lodash"
import invariant from "invariant"

import SortableHeaderCell from "./DataTable/Cell/SortableHeaderCell"
import TableColumnConfig from "./DataTable/TableColumnConfig"
import SortTypes from "./DataTable/SortTypes"

import defaultStyles from "fixed-data-table/dist/fixed-data-table.min.css"

import styles from "lib/DataTable.scss"

const MIN_COLUMN_WIDTH = 10
,     ROW_HEIGHT = 30
,     SCROLL_BAR_HEIGHT = 17;

/**
 * @class
 * 
 * Sorted data list.
 */
class SortedDataList {
  
  /**
   * @constructor
   * 
   * @param  {Number[]} indexMap the index map for this ordered data list.
   * @param  {Object[]} data     the data in this ordered data list.
   */
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  /**
   * Returns the size of this ordered data list.
   * 
   * @return {Number}
   */
  getSize() {
    return this._indexMap.length;
  }

  /**
   * Returns the stored object at index.
   * 
   * @param  {Number} index the specified index.
   * 
   * @return {Object}
   */
  getObjectAt(index) {
    
    invariant(_.inRange(index, 0, this._indexMap.length), `getObjectAt(index) expects 'index' to be in range of [0, ${this._indexMap.length}), but gets '${index}'.`);
    
    return this._data[this._indexMap[index]];
  }
  
}

/**
 * Creates a new SortedDataList based on given data and sort direction.
 * 
 * @param  {Array} data         the data.
 * @param  {Object} colSortDirs the sort direction.
 * 
 * @return {SortedDataList}
 */
function createSortedDataList(data, colSortDirs) {
  
  invariant(_.isArray(data), `createSortedDataList(data, colSortDirs) expects 'data' to be 'array', but gets '${typeof data}'.`);
  invariant(_.isObject(colSortDirs), `createSortedDataList(data, colSortDirs) expects 'colSortDirs' to be 'object', but gets '${typeof colSortDirs}'.`);
  
  let indexMap = _.times(data.length);
  
  if (_.isEmpty(colSortDirs)) {
    return new SortedDataList(indexMap, data);
  }
  
  let columnKey = _.keys(colSortDirs)[0]
  ,   sortDir = _.values(colSortDirs)[0];

  indexMap.sort((indexA, indexB) => {
    
    let valueA = data[indexA][columnKey]
    ,   valueB = data[indexB][columnKey]
    ,   sortVal = 0;

    if (valueA > valueB) {
      sortVal = 1;
    } else if (valueA < valueB) {
      sortVal = -1;
    }
    
    // revert the direction if sort descending
    if (sortVal !== 0 && sortDir === SortTypes.DESC) {
      sortVal = sortVal * -1;
    }

    return sortVal;
    
  });
  
  return new SortedDataList(indexMap, data);
}

/**
 * @class
 * @extends {React.Component}
 *
 * Data table component.
 */
export default class DataTable extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    
    super(props);
    
    this.columnKeys = Object.keys(props.columnKeyToHeader);
    
    let columnWidths = {}
    ,   showColumn = {};
    
    this.columnKeys.forEach((columnKey) => {
      columnWidths[columnKey] = 100;
      
      showColumn[columnKey] = true;
    });
    
    // set the initial size
    this.state = {
      tableWidth: 1000,
      tableHeight: 500,
      
      sortedDataList: createSortedDataList([], {}),      
      showColumn: showColumn,
      columnWidths: columnWidths,      
      // column sort directions, only support sort on single column for now
      colSortDirs: {}
    };
    
  }
  
  /**
   * @inheritdoc
   */
  componentWillReceiveProps(props) {
    
    // rows plus row header
    let rowCount = props.data.length + 1
    ,   tableHeight = rowCount * ROW_HEIGHT + SCROLL_BAR_HEIGHT;

    this.setState({
      sortedDataList: createSortedDataList(props.data, this.state.colSortDirs)
    });    
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    
    if (window.addEventListener) {
      window.addEventListener("resize", _.throttle(this._updateTableWidth, 250), false);
    } else if (window.attachEvent) {
      window.attachEvent("onresize", _.throttle(this._updateTableWidth, 250));
    } else {
      window.onresize = this._updateTableWidth;
    }
    
    this._updateTableWidth();

  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {

    if(window.removeEventListener) {
      window.removeEventListener("resize", _.throttle(this._updateTableWidth, 250), false);
    } else if(window.removeEvent) {
      window.removeEvent("onresize", _.throttle(this._updateTableWidth, 250), false);
    } else {
      window.onresize = null;
    }
    
  }
  
  /**
   * @private
   * Updates the table width based on window's size.
   */
  _updateTableWidth = () => {

    this.setState({
      tableWidth: window.innerWidth - 20
    });
    
  };
  
  /**
   * @private
   * Callback for table's 'column resize end' event.
   * 
   * @param  {Number} newColumnWidth the new column width.
   * @param  {String} columnKey      the columnKey.
   */
  _onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    
    newColumnWidth = Math.max(MIN_COLUMN_WIDTH, newColumnWidth);
    
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
    
  };
  
  /**
   * @private
   * Handler for SortableHeaderCell's 'onSortChange' call.
   * 
   * @param  {String} columnKey the column key to sort on.
   * @param  {String} sortDir   the sort direction.
   */
  _onSortChange = (columnKey, sortDir) => {
    
    let newColSortDirs = {
      [columnKey]: sortDir,
    };
    
    this.setState({
      colSortDirs: newColSortDirs,
      sortedDataList: createSortedDataList(this.props.data, newColSortDirs)
    });
    
  };
  
  /**
   * @private
   * Handler for TableColumnConfig's 'onShowColumnChange' call.
   * 
   * @param  {String} columnKey the column key.
   * @param  {Boolean} show     the new show/hide value.
   */
  _onShowColumnChange = (columnKey, show) => {
    
    let { showColumn } = this.state;
    
    showColumn[columnKey] = show;

    this.setState({
      showColumn: showColumn
    });
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    let classNames = [ styles.dataTable ]
    ,   { className, columnKeyToHeader } = this.props
    ,   { tableWidth, tableHeight, columnWidths, colSortDirs, showColumn, sortedDataList } = this.state
    ,   columnKeys = this.columnKeys;
    
    if (!_.isEmpty(className)) {
      classNames.push(className);
    }
    
    return (
      <div className={classNames.join(' ')}>
        <TableColumnConfig 
          columnKeys={columnKeys}
          showColumn={showColumn}
          columnKeyToHeader={columnKeyToHeader}
          onShowColumnChange={this._onShowColumnChange} 
        />
        <Table
          rowHeight={ROW_HEIGHT}
          rowsCount={sortedDataList.getSize()}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}
          isColumnResizing={false}
          width={tableWidth}
          height={tableHeight}
          headerHeight={ROW_HEIGHT}
        >
          {columnKeys.map((columnKey, index) => {
            
            // only renders specific columns
            if (!showColumn[columnKey]) {
              return null;
            }
            
            return (
              <Column
                key={columnKey}
                columnKey={columnKey}
                header={
                  <SortableHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs[columnKey]}
                  >{columnKeyToHeader[columnKey]}</SortableHeaderCell>
                }
                cell={({rowIndex, ...props}) => (
                  <Cell {...props}>
                    {do {
                      // render empty string if it's an object
                      if (_.isObject(sortedDataList.getObjectAt(rowIndex)[columnKey])) {
                        ""
                      } else {
                        sortedDataList.getObjectAt(rowIndex)[columnKey]
                      }
                    }}
                  </Cell>
                )}
                width={columnWidths[columnKey]}
                flexGrow={1}
                isResizable={true}
              />
            );
            
          })}          
          
        </Table>
      </div>
    );
  }
}

DataTable.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  columnKeyToHeader: React.PropTypes.object.isRequired
};