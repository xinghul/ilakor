import React from "react";
import _ from "lodash";
import invariant from "invariant";

import GridSection from "lib/GridSection";
import BaseInfo from "lib/BaseInfo";
import DataTable from "lib/DataTable";

import styles from "components/ManageApp/OrderManageApp/ItemDetailSection.scss";

// order items table key to header
const columnKeyToHeader = {
  "item.name": "Item",
  "count": "Count",
  "variation.price": "Price",
  "item._id": "Item id",
  "variation._id": "Variation id"
};

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemDetailSection extends React.Component {
  
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
    
    const { items } = this.props;
    
    if (_.isEmpty(items)) {
      return null;
    }
    
    return (
      <GridSection title="Item information" className={styles.itemDetailSection}>
        <DataTable
          data={items} 
          columnKeyToHeader={columnKeyToHeader} 
        />
      </GridSection>
    );
  }
}

ItemDetailSection.propTypes = {
  items: React.PropTypes.array
};

ItemDetailSection.defaultProps = {
  items: []
};
