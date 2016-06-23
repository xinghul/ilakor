"use strict";

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import getCardTypes from "credit-card-type"
import { Image, Button, Glyphicon } from "react-bootstrap"
import { Form, FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import { Grid, Row, Col } from "react-bootstrap"

import styles from "components/CheckoutApp.scss"

import ItemUtil from "utils/ItemUtil"

import GridSection from "lib/GridSection"
import BaseInput from "lib/BaseInput"
import SubmitButton from "lib/SubmitButton"
import AlertMessage from "lib/AlertMessage"
import CreditCardInput from "./CheckoutApp/CreditCardInput"
import PhoneNumberInput from "./CheckoutApp/PhoneNumberInput"
import EmailInput from "./AuthApp/EmailInput"

import ShoppingCartStore from "stores/ShoppingCartStore"
import OrderAction from "actions/OrderAction"
import AuthStore from "stores/AuthStore"

function getStateFromStores() {
  return {
    items: ShoppingCartStore.getItems(),
    totalPrice: ShoppingCartStore.getTotalPrice()
  };
}

export default class CheckoutApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      items: ShoppingCartStore.getItems(),
      totalPrice: ShoppingCartStore.getTotalPrice(),

      errorMessage: "",
      formFilled: false,
      isSubmitting: false,
      checkoutFinish: false
    };
  }
  
  componentDidMount() {
    ShoppingCartStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ShoppingCartStore.removeChangeListener(this._onChange);
  }
  
  _alertMessage = null;

  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  checkFormFilled= () => {
    let formFilled = true
    ,   refValues = this.getRefValues();
    
    for (let value of _.values(refValues))
    {
      if (_.isEmpty(value)) {
        formFilled = false;
        
        break;
      }
    }
    
    this.setState({
      formFilled: formFilled
    });
  };
  
  getRefValues() {
    let refValues = {};
    
    _.forEach(this.refs, function(inputElement, key) {
      refValues[key] = inputElement.getValue();
    });
    
    return refValues;
  }
  
  handleConfirm = () => {
    let refValues = this.getRefValues();
    refValues.items = this.state.items;
    refValues.totalPrice = this.state.totalPrice;
    console.log(refValues);
    
    this.setState({
      isSubmitting: true
    });
    
    OrderAction.addOrder(refValues, AuthStore.getUser())
    .then((response) => {
      console.log("successfully put order.");
      
      this.setState({
        checkoutFinish: true
      });
      
      document.body.scrollTop = 0;
    })
    .catch((err) => {
      console.log(err);
      
      let message = err.message;
      
      invariant(_.isString(message), `Expect error message to be 'string', but get '${typeof message}'.`);
      
      this.setState({
        errorMessage: message
      });
      
      this._alertMessage.showAlert();
    })
    .finally(() => {
      this.setState({
        isSubmitting: false
      });
    });
  };
  
  handleValueChange = () => {
    setTimeout(() => {
      this.checkFormFilled();
    });
  };
  
  createSummary() {
    let subStyle = {
      marginBottom: "5px"
    };
    
    let subLabelStyle = {
      fontStyle: "italic"
    };
    
    let subPriceStyle = {
      float: "right"
    };
      
    let totleStyle = {
      marginTop: "10px",
      fontSize: "16px",
      fontWeight: "600"
    };
    
    let totlePriceStyle = {
      float: "right"
    };
    
    let items = this.state.items
    ,   itemPriceJsx = []
    ,   subTotle = this.state.totalPrice;

    for (let key of Object.keys(items))
    {
      let item = items[key];
      
      itemPriceJsx.push(
        <div key={key} style={subStyle}>
          <span style={subLabelStyle}>{item.item.price} x {item.count} {item.item.name}</span>
          <span style={subPriceStyle}>{ItemUtil.createPriceJsx(item.item.price * item.count)}</span>
        </div>
      );
    }
    
    // hard coded for now
    let discount = 0
    ,   shipping = 7
    ,   tax = subTotle * 0.08
    ,   totle = subTotle - discount + shipping + tax;
    
    return (
      <div>
        <div className={styles.sectionHeader}>
          Receipt summary
        </div>
        {itemPriceJsx}
        <div style={subStyle} style={subStyle}>
          <span style={subLabelStyle}>Discount</span>
          <span style={subPriceStyle}>{ItemUtil.createPriceJsx(discount)}</span>
        </div>
        <div style={subStyle}>
          <span style={subLabelStyle}>Subtotal</span>
          <span style={subPriceStyle}>{ItemUtil.createPriceJsx(subTotle)}</span>
        </div>
        <div style={subStyle}>
          <span style={subLabelStyle}>Shipping</span>
          <span style={subPriceStyle}>{ItemUtil.createPriceJsx(shipping)}</span>
        </div>
        <div style={subStyle}>
          <span style={subLabelStyle}>Tax</span>
          <span style={subPriceStyle}>{ItemUtil.createPriceJsx(tax)}</span>
        </div>
        <div style={totleStyle}>
          <span>Total</span>
          <span style={totlePriceStyle}>{ItemUtil.createPriceJsx(totle)}</span>
        </div>
      </div>
    );
  }
  
  createShipping() {

    return (
      <div>
        <div className={styles.sectionHeader}>
          Shipping information
        </div>
        <Form>
          <Row>
            <Col xs={6} md={6}>
              <BaseInput ref="firstName" label="First Name" autoComplete="given-name" shrink={true} handleChange={this.handleValueChange} />
            </Col>
            <Col xs={6} md={6}>
              <BaseInput ref="lastName" label="Last Name" autoComplete="family-name" shrink={true} handleChange={this.handleValueChange} />
            </Col>
          </Row>
          <BaseInput ref="street" label="Street" autoComplete="address-line1" shrink={true} handleChange={this.handleValueChange} />
          <Row>
            <Col xs={5} md={5}>
              <BaseInput ref="city" label="City" autoComplete="address-level2" shrink={true} handleChange={this.handleValueChange} />
            </Col>
            <Col xs={3} md={3}>
              <BaseInput ref="state" label="State" autoComplete="address-level1" shrink={true} handleChange={this.handleValueChange} />
            </Col>
            <Col xs={4} md={4}>
              <BaseInput ref="zip" label="Zip" autoComplete="postal-code" shrink={true} handleChange={this.handleValueChange} />
            </Col>
          </Row>
        </Form>
        <Form>
          <PhoneNumberInput ref="phoneNumber" handleChange={this.handleValueChange} />
        </Form>
        <Form>
          <EmailInput ref="email" isRegister={false} shrink={true} handleChange={this.handleValueChange} />
        </Form>
      </div>
    );
  }
  
  createPayment() {
    
    let infoStyle = {
      color: "rgba(149, 149, 149, 0.7)",
      textAlign: "center",
      marginTop: "5px",
      fontSize: "13px"
    };
    
    let monthOptions = [];
    
    monthOptions.push(
      <option value="1" key="1">January</option>,
      <option value="2" key="2">February</option>,
      <option value="3" key="3">March</option>,
      <option value="4" key="4">April</option>,
      <option value="5" key="5">May</option>,
      <option value="6" key="6">June</option>,
      <option value="7" key="7">July</option>,
      <option value="8" key="8">August</option>,
      <option value="9" key="9">September</option>,
      <option value="10" key="10">October</option>,
      <option value="11" key="11">November</option>,
      <option value="12" key="12">December</option>
    );
    
    let yearOptions = [];
    
    yearOptions.push(
      <option value="2016" key="2016">2016</option>,
      <option value="2017" key="2017">2017</option>,
      <option value="2018" key="2018">2018</option>,
      <option value="2019" key="2019">2019</option>,
      <option value="2020" key="2020">2020</option>,
      <option value="2021" key="2021">2021</option>,
      <option value="2022" key="2022">2022</option>,
      <option value="2023" key="2023">2023</option>,
      <option value="2024" key="2024">2024</option>
    );
    
    return (
      <div>
        <div className={styles.sectionHeader}>
          Payment information
        </div>
        <Form>
          <BaseInput ref="nameOnCard" label="Name on Card" autoComplete="cc-name" icon="user" handleChange={this.handleValueChange} />
          <CreditCardInput ref="cardNumber" handleChange={this.handleValueChange} />
          <Row>
            <Col xs={6} md={6}>
              <BaseInput ref="expireMonth" initialValue="1" type="select" label="Month" options={monthOptions} shrink={true} handleChange={this.handleValueChange} />
            </Col>
            <Col xs={6} md={6}>
              <BaseInput ref="expireYear" initialValue="2016" placeholder="Select year" type="select" label="Year" options={yearOptions} shrink={true} handleChange={this.handleValueChange} />
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
              <BaseInput ref="cvc" label="CVC" autoComplete="cc-csc" shrink={true} handleChange={this.handleValueChange} />
            </Col>
            <Col xs={6} md={4}>
              <span className={styles.cvcHelper}><a>What is CVC?</a></span>
            </Col>
          </Row>
        </Form>
        <AlertMessage alertMessage={this.state.errorMessage} alertStyle="danger" ref={(component) => {
          this._alertMessage = component;
        }}/>
        <SubmitButton
          disabled={!this.state.formFilled || this.state.isSubmitting} 
          handleSubmit={this.handleConfirm}
          isSubmitting={this.state.isSubmitting}
          block
          bsStyle="warning"
        >
          <Glyphicon glyph="lock" />
          {' '}
          BOOK SECURELY
        </SubmitButton>
        <div style={infoStyle}>
          <Glyphicon glyph="lock" />
          {' '}
          Your card information is encrypted
        </div>
      </div>
    );
  }
  
  createConfirmation() {
    return (
      <div>
        <div className={styles.sectionHeader}>
          Confirmation
        </div>
        <div>
          Thank you for shopping with us. We’ll send a confirmation when your item ships.
        </div>
      </div>
    );
  }

  render() {

    let items = this.state.items;
    
    return (
      <div className={styles.checkoutApp}>
        <div className={styles.checkoutForm}>
          <div hidden={this.state.checkoutFinish}>
            <div className={styles.summarySection}>
              {this.createSummary()}
            </div>
            <div className={styles.shippingSection}>
              {this.createShipping()}
            </div>
            <div className={styles.paymentSection}>
              {this.createPayment()}
            </div>
          </div>
          <div id="confirmationSection" className={styles.confirmationSection} 
            hidden={!this.state.checkoutFinish}>
            {this.createConfirmation()}
          </div>
        </div>
      </div>
    );
  }
}
