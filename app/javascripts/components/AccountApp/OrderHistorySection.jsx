import React from "react";
import _ from "lodash";
import invariant from "invariant";

import GridSection from "lib/GridSection";
import LoadSpinner from "lib/LoadSpinner";
import DataTable from "lib/DataTable";

import AccountStore from "stores/AccountStore";

import AccountAction from "actions/AccountAction";

import styles from "components/AccountApp/OrderHistorySection.scss";

// orders table key to header
const columnKeyToHeader = {
  "_id": "Id",
  "created": "Created",
  "stripe.amount": "Amount",
  "sent": "Order sent"
};
/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    orders: AccountStore.getOrders()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class OrderHistorySection extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    AccountStore.subscribe(this._onChange);

    AccountAction.getOrders(this.props.user._id);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AccountStore.unsubscribe(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { orders } = this.state;

    return (
      <GridSection title="Order history" className={styles.orderHistorySection}>
        <DataTable
          data={orders} 
          columnKeyToHeader={columnKeyToHeader} 
        />
      </GridSection>
    );
  }
}

OrderHistorySection.propTypes = {
  user: React.PropTypes.object.isRequired
};
