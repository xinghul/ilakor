import React from "react";
import _ from "lodash";
import Numeral from "numeral";
import invariant from "invariant";
import { Pager } from "react-bootstrap";

import GridSection from "lib/GridSection";
import GhostButton from "lib/GhostButton";

import styles from "components/CheckoutApp/SummarySection.scss";


/**
 * @class
 * @extends {React.Component}
 */
export default class SummarySection extends React.Component {

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
    
    const { onPrevious, onSubmit } = this.props;
    
    return (
      <GridSection>
        {this._createSummaryJsx()}
        <Pager>
          <Pager.Item previous onClick={onPrevious}>&larr; Previous</Pager.Item>
          <GhostButton
            onClick={onSubmit}
            block
            theme="success"
          >Next</GhostButton>
        </Pager>
      </GridSection>
    );
    
  }

  /**
   * @private
   * Creates the JSX for the summary section.
   *
   * @return {JSX}
   */
  _createSummaryJsx() {
    
    const { items, totalPrice } = this.props;

    let itemPriceJsx = _.map(items, (itemInfo) => {
      let priceForVariation = itemInfo.variation.price * itemInfo.count;

      return (
        <div key={itemInfo.variation._id} className={styles["summary-item"]}>
          <span className={styles["label-style"]}>{priceForVariation} {itemInfo.item.name}</span>
          <span className={styles["price-style"]}>{Numeral(priceForVariation).format("$0,0.00")}</span>
        </div>
      );
    });

    // hard coded for now
    let discount = 0
    ,   shipping = 7
    ,   tax = totalPrice * 0.08
    ,   finalPrice = totalPrice - discount + shipping + tax;

    return (
      <div className={styles["summary-section"]}>
        <div className={styles["summary-header"]}>
          Receipt summary
        </div>
        {itemPriceJsx}
        <div className={styles["summary-item"]}>
          <span className={styles["label-style"]}>Discount</span>
          <span className={styles["price-style"]}>{Numeral(discount).format("$0,0.00")}</span>
        </div>
        <div className={styles["summary-item"]}>
          <span className={styles["label-style"]}>Subtotal</span>
          <span className={styles["price-style"]}>{Numeral(totalPrice).format("$0,0.00")}</span>
        </div>
        <div className={styles["summary-item"]}>
          <span className={styles["label-style"]}>Shipping</span>
          <span className={styles["price-style"]}>{Numeral(shipping).format("$0,0.00")}</span>
        </div>
        <div className={styles["summary-item"]}>
          <span className={styles["label-style"]}>Tax</span>
          <span className={styles["price-style"]}>{Numeral(tax).format("$0,0.00")}</span>
        </div>
        <div className={styles["total-price"]}>
          <span>Total</span>
          <span className={styles["price-style"]}>{Numeral(finalPrice).format("$0,0.00")}</span>
        </div>
      </div>
    );
  }
  
}

SummarySection.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  totalPrice: React.PropTypes.number.isRequired,
  
  onSubmit: React.PropTypes.func,
  onPrevious: React.PropTypes.func
};

SummarySection.defaultProps = {
  onSubmit: () => {},
  onPrevious: () => {}
};
