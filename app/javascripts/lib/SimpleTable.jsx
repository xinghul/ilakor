import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Table } from "react-bootstrap";

import GridSection from "lib/GridSection";
import LoadSpinner from "lib/LoadSpinner";
import SubmitButton from "lib/SubmitButton";

import styles from "lib/SimpleTable.scss";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores(store) {
  return {
    isLoading: store.getIsLoading()
  };
}

export default class SimpleTable extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: this.props.store.getIsLoading(),
      
      isDeleting: false,
      selectedData: null
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    this.props.store.subscribe(this._onChange);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    this.props.store.unsubscribe(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores(this.props.store));
  };
  
  /**
   * @private
   * Handler for when a brand item is selected.
   * 
   * @param  {Object} selectedData the selected brand.
   */
  _onBrandClick = (selectedData) => {

    this.setState({
      selectedData: selectedData
    });
    
  };
  
  /**
   * @private
   * Handler for when delete is clicked.
   */
  _onDelete = () => {

    if (!_.isFunction(this.props.removeHandler)) {
      return;
    };
    
    this.setState({
      isDeleting: true
    });
    
    this.props.removeHandler(
      this.state.selectedData._id
    ).catch((err) => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isDeleting: false
      });
    });
    
  };
  
  /**
   * @private
   * Renders the brand list table.
   *
   * @return {JSX}
   */
  _renderTable() {
    
    let data = this.props.data
    ,   tableHeader = []
    ,   tableBody = []
    ,   buttonDisabled = _.isEmpty(this.state.selectedData);
    
    if (_.isEmpty(data)) {
      return <div className={styles.emptyTable}>Empty table</div>;
    }
    
    tableHeader = _.keys(data[0]);
    
    _.pull(tableHeader, "__v");
    
    let headers = _.clone(tableHeader);
    
    for (let item of data)
    {
      tableBody.push(
        <tr onClick={this._onBrandClick.bind(this, item)} key={item._id}>
          <td key={_.uniqueId(item._id)}>{data.indexOf(item)}</td>
          {_.map(headers, (key) => {
            
            let value = item[key];
            
            if (_.isBoolean(value)) {
              value = value ? "Yes" : "No";
            } else if (_.isFunction(value) || _.isObject(value)) {
              _.pull(tableHeader, key);
              
              return null;
            }
            
            return (
              <td key={_.uniqueId(item._id)}>{value}</td>
            );
            
          })}
        </tr>
      );
    }
    
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              {_.map(tableHeader, (header) => {
                return (
                  <th key={_.uniqueId(header)}>{_.capitalize(header)}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
        </Table>
        <div hidden={!_.isFunction(this.props.removeHandler)}>
          <SubmitButton
            theme="danger" 
            disabled={buttonDisabled}
            isSubmitting={this.state.isDeleting}
            handleSubmit={this._onDelete}
          >Delete</SubmitButton>
        </div>
      </div>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.simpleTable}>
        <GridSection title={this.props.title}>
          {do {
            if (this.state.isLoading) {
              <LoadSpinner className={styles.loadSpinner} />;
            } else {
              this._renderTable();
            }
          }}
        </GridSection>
      </div>
    );
    
  }
}

SimpleTable.propTypes = {
  store: React.PropTypes.object.isRequired,
  
  data: React.PropTypes.array,
  title: React.PropTypes.string,
  removeHandler: React.PropTypes.func
};

SimpleTable.defaultProps = {
  data: [],
  title: "Table",
  removeHandler: null
};

