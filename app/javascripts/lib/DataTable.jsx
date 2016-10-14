import React from "react";
import { findDOMNode } from "react-dom";
import { Table, Column, Cell } from "fixed-data-table";
import _ from "lodash";
import invariant from "invariant";

import SortableHeaderCell from "./DataTable/Cell/SortableHeaderCell";
import TableColumnConfig from "./DataTable/TableColumnConfig";
import SortTypes from "./DataTable/SortTypes";

import LoadSpinner from "lib/LoadSpinner";
import Input from "lib/Input";

import defaultStyles from "fixed-data-table/dist/fixed-data-table.min.css";

import styles from "lib/DataTable.scss";

const MIN_COLUMN_WIDTH = 10
,     ROW_HEIGHT = 42
,     SCROLL_BAR_HEIGHT = 17;

/**
 * Returns value in object with key contains dot.
 * 
 * @param  {Object} obj the given object
 * @param  {String} rawKey the key.
 * 
 * @return {String}
 */
function getValueByKey(obj, rawKey) {
  
    rawKey = rawKey.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    rawKey = rawKey.replace(/^\./, '');           // strip a leading dot
    
    let keys = rawKey.split('.');
    
    for (let key of keys) {
      if (obj.hasOwnProperty(key)) {
        obj = obj[key];
      } else {
        return;
      }
    }
    
    return obj;
}

/**
 * Returns readable value based on given raw input.
 * 
 * @param  {Any} value the given raw input.
 * 
 * @return {String}
 */
function readableValue(value) {
  
  if (_.isBoolean(value)) {
    return value ? "Yes" : "No";
  } else if (_.isArray(value)) {
    let result = _.map(value, (obj) => {
      return readableValue(obj);
    });
    
    return result.join(", ");
  } else if (_.isObject(value)) {

    // try name
    if (_.isString(value.name)) {
      return value.name;
    }
    
    // try _id
    if (_.isString(value._id)) {
      return value._id;
    }
    
    return "";
  } 
  
  // treat as string
  return value;
}

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
    
    this.columnKeys = _.keys(props.columnKeyToHeader);
    
    this.throttledUpdateTableWidth = _.throttle(this._updateTableWidth, 250);
    
    let columnWidths = {}
    ,   showColumn = {};
    this.columnKeys.forEach((columnKey) => {
      columnWidths[columnKey] = 100;
      
      showColumn[columnKey] = _.isBoolean(props.showColumn[columnKey]) ? 
                              props.showColumn[columnKey] : true;
    });
    
    // set the initial size
    this.state = {
      tableWidth: 0,
      tableHeight: 500,
      
      selectedRowIndex: null,
      
      showColumn: showColumn,
      columnWidths: columnWidths,      
      // column sort directions, only support sort on single column for now
      colSortDirs: {},
      // client-side filter
      filter: ""
    };
    
    this.sortedDataList = this._createSortedDataList();
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    
    if (window.addEventListener) {
      window.addEventListener("resize", this.throttledUpdateTableWidth, false);
    } else if (window.attachEvent) {
      window.attachEvent("onresize", this.throttledUpdateTableWidth, false);
    } else {
      window.onresize = this.throttledUpdateTableWidth;
    }
    
    this._updateTableWidth();

  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {

    if (window.removeEventListener) {
      window.removeEventListener("resize", this.throttledUpdateTableWidth, false);
    } else if(window.removeEvent) {
      window.removeEvent("onresize", this.throttledUpdateTableWidth, false);
    } else {
      window.onresize = null;
    }
    
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { data, className, columnKeyToHeader, isLoading } = this.props;
    const { tableWidth, tableHeight, columnWidths, filter, colSortDirs, showColumn, selectedRowIndex } = this.state;
    const { columnKeys } = this;

    let classNames = [ styles.dataTable ]
    ,   sortedDataList;
    
    if (!_.isEmpty(className)) {
      classNames.push(className);
    }
    
    this.sortedDataList = sortedDataList = this._createSortedDataList();
    
    return (
      <div className={classNames.join(' ')}>
        <div className={styles.tableConfig}>
          <Input
            placeholder="filter result..."
            className={styles.filter}
            onChange={this._onFilterChange}
          />
          <TableColumnConfig 
            columnKeys={columnKeys}
            showColumn={showColumn}
            columnKeyToHeader={columnKeyToHeader}
            onShowColumnChange={this._onShowColumnChange} 
          />
        </div>
        {do {
          if (isLoading) {
            <LoadSpinner className={styles.loadSpinner} size={40} />
          } else {
            <Table
              rowHeight={ROW_HEIGHT}
              rowsCount={sortedDataList.getSize()}
              onRowClick={this._onRowClick}
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
                    cell={({rowIndex, ...props}) => {
                      let obj = sortedDataList.getObjectAt(rowIndex)
                      ,   value = getValueByKey(obj, columnKey);
                      
                      return <TextCell {...props} text={readableValue(value)} className={rowIndex === selectedRowIndex ? styles.selectedCell : ""} />;

                      // return (
                      //   <Cell {...props} className={rowIndex === selectedRowIndex ? styles.selectedCell : ""}>
                      //     {readableValue(value)}
                      //   </Cell>
                      // );
                      
                    }}
                    width={columnWidths[columnKey]}
                    flexGrow={1}
                    isResizable={true}
                  />
                );
                
              })}          
              
            </Table>
          }
        }}
        
      </div>
    );
  }
  
  /**
   * @private
   * Creates a new SortedDataList based on current state.
   * 
   * @return {SortedDataList}
   */
  _createSortedDataList = () => {

    const { columnKeys } = this;
    const { data } = this.props;
    const { colSortDirs, filter, showColumn } = this.state;
          
    let indexMap = [];
    
    // apply filter
    _.times(data.length, (index) => {
      let obj = data[index]
      ,   foundMatch = false;
      
      _.forEach(columnKeys, (columnKey) => {
        // skips the hidden columns or if match has been found
        if (!showColumn[columnKey] || foundMatch) {
          return;
        }
        
        let value = readableValue(getValueByKey(obj, columnKey));
        
        if (_.includes(_.toLower(value), _.toLower(filter))) {
          foundMatch = true;
        }
      });
      
      if (foundMatch) {
        indexMap.push(index);
      }
      
    });
    
    if (_.isEmpty(colSortDirs)) {
      return new SortedDataList(indexMap, data);
    }
    
    let columnKey = _.keys(colSortDirs)[0]
    ,   sortDir = _.values(colSortDirs)[0];

    indexMap.sort((indexA, indexB) => {
      
      let valueA = readableValue(getValueByKey(data[indexA], columnKey))
      ,   valueB = readableValue(getValueByKey(data[indexB], columnKey))
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
  };
  
  /**
   * @private
   * Updates the table width based on window's size.
   */
  _updateTableWidth = () => {

    let node = findDOMNode(this);

    this.setState({
      tableWidth: (node.offsetWidth || window.innerWidth) - 30
    });
    
  };
  
  /**
   * @private
   * Handler for when the filter value changes.
   *
   * @param {String} value the new filter value.
   */
  _onFilterChange = (value) => {

    // clear selected row when filter changes
    this.setState({
      filter: value,
      selectedRowIndex: null
    });
    
  };
  
  /**
   * @private
   * Handler for when a row is clicked.
   *
   * @param {Object} evt the event object.
   * @param {Number} rowIndex the clicked row index.
   */
  _onRowClick = (evt, rowIndex) => {
    
    const { sortedDataList } = this;
    let { selectedRowIndex } = this.state;
    let selectedData = null;
    
    // de-select if it's already selected
    if (selectedRowIndex === rowIndex) {
      selectedRowIndex = null;
    } else {
      selectedRowIndex = rowIndex;
      
      selectedData = sortedDataList.getObjectAt(selectedRowIndex);
    }
    
    this.setState({
      selectedRowIndex
    });

    this.props.onRowSelect(selectedData);
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
    
    const { filter } = this.state;
    
    let newColSortDirs = {
      [columnKey]: sortDir,
    };
    
    // also reset selected row index
    this.setState({
      colSortDirs: newColSortDirs,
      selectedRowIndex: null
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
      showColumn
    });
  };
}

const TextCell = ({text, ...props}) => (
  <Cell {...props}>
    {text}
  </Cell>
);

DataTable.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  columnKeyToHeader: React.PropTypes.object.isRequired,
  
  showColumn: React.PropTypes.object,
  onRowSelect: React.PropTypes.func,
  isLoading: React.PropTypes.bool
};

DataTable.defaultProps = {
  showColumn: {},
  onRowSelect: () => {},
  isLoading: false
};