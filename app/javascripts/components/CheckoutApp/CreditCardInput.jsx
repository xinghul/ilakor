"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import CardValidator from "card-validator"

import MaskedInput from "lib/MaskedInput"

import styles from "components/CheckoutApp/CreditCardInput.scss"

const CARD_TO_ICON = {
  "visa": "cc-visa",
  "master-card": "cc-mastercard",
  "american-express": "cc-amex",
  "diners-club": "cc-diners-club",
  "discover": "cc-discover",
  "jcb": "cc-jcb",
  "default": "credit-card-alt"
};

/**
 * Validates a card based on given card number.
 * 
 * @param  {String} cardNumber the card number.
 * 
 * @return {String} the validation result.
 */
function validateCard(cardNumber) {
  
  invariant(_.isString(cardNumber), `validateCard() expects a string as input, but gets '${typeof cardNumber}'.`);
  
  let result = CardValidator.number(cardNumber);

  if (result.isValid) {
    return "success";
  } else if (result.isPotentiallyValid) {
    return "";
  }
  
  return "error";
}

/**
 * Returns a card icon based on given card number.
 
 * @param  {String} cardNumber the card number.
 * 
 * @return {String} the icon for MaskedInput.
 */
function getCardIcon(cardNumber) {
  invariant(_.isString(cardNumber), `getCardIcon() expects a string as input, but gets '${typeof cardNumber}'.`);
  
  let result = CardValidator.number(cardNumber);
  
  if (!_.isEmpty(result.card)) {
    return CARD_TO_ICON[result.card.type];
  }
  
  return CARD_TO_ICON["default"];
}

/**
 * Returns a card mask based on given card number.
 
 * @param  {String} cardNumber the card number.
 * 
 * @return {String} the mask for MaskedInput.
 */
function getCardMask(cardNumber) {
  invariant(_.isString(cardNumber), `getCardMask() expects a string as input, but gets '${typeof cardNumber}'.`);
  
  let result = CardValidator.number(cardNumber)
  ,   mask = "";
  
  if (!_.isEmpty(result.card)) {
    let length = result.card.lengths[0]
    ,   gaps = result.card.gaps
    ,   gapIndex = 0;
    
    for (let count = 0; count < length; count++)
    {
      if (count === gaps[gapIndex]) {
        mask += " ";
        
        gapIndex++;
      }
      
      mask += "9";      
    }    
  } else {
    mask = "9999 9999 9999 9999";
  }
  
  return mask;  
}

export default class CreditCardInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: ""
    };
  }
  
  handleChange = (newValue, name) => {    
    this.setState({
      value: newValue
    });
    
    this.props.handleChange(newValue, name);
  };
  
  
  getValue() {
    return _.replace(this.state.value, /\s/g, '');
  }
  
  clear() {
    this.setState({
      value: ""
    });
    
    this.refs["maskedInput"].clear();
  }
  
  render() {
    
    return (
      <div className={styles.creditCardInput}>
        <MaskedInput
          {...this.props}
          ref="maskedInput"
          autoComplete="cc-number"
          mask={getCardMask(this.state.value)}
          validationState={validateCard(this.state.value)} 
          label="Card number"
          icon={getCardIcon(this.state.value)}
          value={this.state.value}
          handleChange={this.handleChange}
        />
      </div>
      
    );
  }
}

CreditCardInput.propTypes = {
  handleChange: React.PropTypes.func
};

CreditCardInput.defaultProps = {
  handleChange: function() {}
};
