"use strict";

import React from "react"
import _ from "underscore"
import getCardTypes from "credit-card-type"
import CreditCard from "credit-card"
import { Image, Button, Glyphicon } from "react-bootstrap"
import { Form, FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import { Grid, Row, Col } from "react-bootstrap"

import styles from "components/CheckoutApp.scss"

import ItemUtil from "utils/ItemUtil"

import BaseSpinner from "lib/BaseSpinner.jsx"

import ShoppingCartStore from "stores/ShoppingCartStore"
import CheckoutStore from "stores/CheckoutStore"
import CheckoutAction from "actions/CheckoutAction"
import AuthStore from "stores/AuthStore"

function getStateFromStores() {
  return {
    errorMsg: CheckoutStore.getErrorMsg(),
    items: ShoppingCartStore.getItems(),
    totalPrice: ShoppingCartStore.getTotalPrice()
  };
}

function validateZip(zip) {
  let validZipReg = /^\d{5}$/;
  
  if (_.isEmpty(zip)) {
    return;
  }
  
  if (zip.length < 5) {
    return "warning";
  } else if (validZipReg.test(zip)) {
    return "success";
  }
  
  return "error";
}

function validatePhoneNumber(phoneNumber) {
  if (_.isEmpty(phoneNumber)) {
    return;
  }
  
  if (phoneNumber.length < 14) {
    return "warning";
  } else {
    return "success";
  }
}

function validateEmail(email) {
  let validEmailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  
  if (_.isEmpty(email)) {
    return;
  }

  if (validEmailReg.test(email)) {
    return "success";
  }
  
  return "warning";
}

function validateCard(cardNumber, cardType) {
  if (_.isEmpty(cardNumber)) {
    return;
  }
  
  let validateResult = CreditCard.validate({
    cardType: cardType,
    number: cardNumber
  });
  
  if (validateResult.validCardNumber) {
    return "success";
  }
  
  return "error";
}

export default class CheckoutApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.phoneNumberPattern = new RegExp(/^\d{0,10}$/);
    this.phoneNumberMask = "(___) ___-____";
    
    this.state = {
      errorMsg: CheckoutStore.getErrorMsg(),
      items: ShoppingCartStore.getItems(),
      totalPrice: ShoppingCartStore.getTotalPrice(),

      formFilled: false,
      isSubmitting: false,
      checkoutFinish: false,
      
      // shipping
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phoneNumber: "",
      email: "",
      
      // payment
      nameOnCard: "",
      cardNumber: "",
      cardType: "visa",
      expireMonth: "1",
      expireYear: "2016",
      cvc: ""
    };
  }
  
  componentDidMount() {
    ShoppingCartStore.addChangeListener(this._onChange);

    CheckoutStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ShoppingCartStore.removeChangeListener(this._onChange);

    CheckoutStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  checkFormFilled= () => {
    let formFilled = !(
      _.isEmpty(this.state.firstName) || _.isEmpty(this.state.lastName) || _.isEmpty(this.state.street) || 
      _.isEmpty(this.state.city) || _.isEmpty(this.state.state) || _.isEmpty(this.state.zip) || 
      _.isEmpty(this.state.phoneNumber) || _.isEmpty(this.state.email) || _.isEmpty(this.state.nameOnCard) || 
      _.isEmpty(this.state.cardNumber) || _.isEmpty(this.state.cardType) || _.isEmpty(this.state.cvc)
    );
    
    this.setState({
      formFilled: formFilled
    });
  };
  
  handleConfirm = () => {
    console.log("submitting", this.state);
    let me = this;
    
    this.setState({
      isSubmitting: true
    });
    
    CheckoutAction.checkout(this.state, AuthStore.getUser())
    .then(function(response) {
      console.log("successfully put order.");
      
      me.setState({
        checkoutFinish: true
      });
      
      document.body.scrollTop = 0;
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  
  handleValueChange = (key, evt) => {
    let value = evt.target.value;
    
    this.setState({
      [key]: value
    });
    
    setTimeout(() => {
      this.checkFormFilled();
    });
  };
  
  handleCardNumberChange = (evt) => {
    let value = evt.target.value;

    let card = getCardTypes(value)[0]
    ,   cardType = "visa";
    
    if (!_.isEmpty(card)) {
      cardType = card.type;
    }
    
    this.setState({
      cardNumber: value,
      cardType: cardType
    });
    
    setTimeout(() => {
      this.checkFormFilled();
    });
  };
  
  handlePhoneNumberChange = (evt) => {
    let maskedValue = evt.target.value
    ,   numericValue = maskedValue.replace(/\D/g, '');

    if (this.phoneNumberPattern.test(numericValue)) {
      
      let numbers = [...numericValue.toString()]
      ,   mask = this.phoneNumberMask;
      for (let number of numbers)
      {
        mask = mask.replace('_', number);
      }
      
      let dashIndex = mask.indexOf('_');
      dashIndex = do {
        if (dashIndex === -1) {
          0
        } else {
          dashIndex
        }
      }
      
      // handle case (___) ___-____, (xxx) ___-____ and (xxx) xxx-____
      if (dashIndex === 1) {
        dashIndex -= 1;
      }
      else if (dashIndex === 6) {
        dashIndex -= 2;
      } else if (dashIndex === 10) {
        dashIndex -= 1;
      }
      
      if (numbers.length < 10) {
        mask = mask.slice(0, dashIndex);        
      }
      
      this.setState({
        phoneNumber: mask
      });
      
      setTimeout(() => {
        this.checkFormFilled();
      });
    }
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
          <span style={subLabelStyle}>{item.item.feature.price} x {item.count} {item.item.name}</span>
          <span style={subPriceStyle}>{ItemUtil.createPriceJsx(item.item.feature.price * item.count)}</span>
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
    let labelStyle = {
      color: "rgba(149, 149, 149, 0.7)",
      
      fontWeight: "normal"
    };
        
    return (
      <div>
        <div className={styles.sectionHeader}>
          Shipping information
        </div>
        <Form>
          <Row>
            <Col xs={6} md={5}>
              <FormGroup bsSize="small" controlId="firstName">
                <ControlLabel style={labelStyle}>First Name</ControlLabel>
                <FormControl value={this.state.firstName} 
                  autoComplete="given-name"
                  onChange={this.handleValueChange.bind(this, "firstName")} type="text" />
              </FormGroup>
            </Col>
            <Col xs={6} md={5}>
              <FormGroup bsSize="small" controlId="lastName">
                <ControlLabel style={labelStyle}>Last Name</ControlLabel>
                <FormControl value={this.state.lastName} 
                  autoComplete="family-name"
                  onChange={this.handleValueChange.bind(this, "lastName")} type="text" />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Form>
          <FormGroup bsSize="small" controlId="street">
            <ControlLabel style={labelStyle}>Street</ControlLabel>
            <FormControl
              autoComplete="address-line1"
              value={this.state.street} 
              onChange={this.handleValueChange.bind(this, "street")} type="text" />
          </FormGroup>
        </Form>
        <Form>
          <Row>
            <Col xs={5} md={5}>
              <FormGroup bsSize="small" controlId="city">
                <ControlLabel style={labelStyle}>City</ControlLabel>
                <FormControl value={this.state.city} 
                  autoComplete="address-level2"
                  onChange={this.handleValueChange.bind(this, "city")} type="text" />
              </FormGroup>
            </Col>
            <Col xs={3} md={3}>
              <FormGroup bsSize="small" controlId="state">
                <ControlLabel style={labelStyle}>State</ControlLabel>
                <FormControl value={this.state.state} 
                  autoComplete="address-level1"
                  onChange={this.handleValueChange.bind(this, "state")} type="text" />
              </FormGroup>
            </Col>
            <Col xs={4} md={4}>
              <FormGroup bsSize="small" 
                validationState={validateZip(this.state.zip)} controlId="zip">
                <ControlLabel style={labelStyle}>Zip</ControlLabel>
                <FormControl value={this.state.zip} 
                  autoComplete="postal-code"
                  onChange={this.handleValueChange.bind(this, "zip")} type="text" />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Form>
          <Row>
            <Col xs={12} md={4}>
              <FormGroup bsSize="small" 
                validationState={validatePhoneNumber(this.state.phoneNumber)} 
                controlId="phoneNumber">
                <ControlLabel style={labelStyle}>Phone</ControlLabel>
                <FormControl value={this.state.phoneNumber} 
                  autoComplete="tel"
                  onChange={this.handlePhoneNumberChange} type="text" />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup bsSize="small" 
                validationState={validateEmail(this.state.email)}
                controlId="email">
                <ControlLabel style={labelStyle}>Email</ControlLabel>
                <FormControl value={this.state.email} 
                  autoComplete="email"
                  onChange={this.handleValueChange.bind(this, "email")} type="text" />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
  
  createPayment() {
    let labelStyle = {
      color: "rgba(149, 149, 149, 0.7)",
      
      fontWeight: "normal"
    };
    
    let infoStyle = {
      color: "rgba(149, 149, 149, 0.7)",
      textAlign: "center",
      marginTop: "5px",
      fontSize: "13px"
    };
    
    let cartStyle = {
      position: "relative"
    };
    
    let cardImageStyle = {
      position: "absolute",
      height: "33px",
      right: "5px",
      top: "18px"    
    };
    
    let cardImageSrc = `/images/cards/${this.state.cardType}.png`;
    
    return (
      <div>
        <div className={styles.sectionHeader}>
          Payment information
        </div>
        <Form>
          <FormGroup bsSize="small" controlId="nameOnCard">
            <ControlLabel style={labelStyle}>Name on Card</ControlLabel>
            <FormControl
              type="text"
              autoComplete="cc-name"
              value={this.state.nameOnCard}
              onChange={this.handleValueChange.bind(this, "nameOnCard")}
            />
          </FormGroup>
        </Form>
        <Form>
          <FormGroup style={cartStyle} bsSize="small" 
            validationState={validateCard(this.state.cardNumber, this.state.cardType)} 
            controlId="cardNumber">
            <ControlLabel style={labelStyle}>Card Number</ControlLabel>
            <FormControl
              type="text"
              autoComplete="cc-number"
              value={this.state.cardNumber}
              onChange={this.handleCardNumberChange}
            />
            <Image style={cardImageStyle} 
              src={cardImageSrc} />
          </FormGroup>
        </Form>
        <Form>
          <FormGroup bsSize="small" controlId="expire">
            <ControlLabel style={labelStyle}>Expires on</ControlLabel>
            <Row>
              <Col xs={6} md={4}>
                <FormControl value={this.state.expireMonth} 
                  onChange={this.handleValueChange.bind(this, "expireMonth")}
                  componentClass="select" placeholder="Month">
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </FormControl>
              </Col>
              <Col xs={6} md={4}>
                <FormControl value={this.state.expireYear}
                  onChange={this.handleValueChange.bind(this, "expireYear")}
                  componentClass="select" placeholder="Year">
                  <option value="2016">2016</option>
                  <option value="2017">2017</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </FormControl>
              </Col>
            </Row>
          </FormGroup>
        </Form>
        <Form>
          <Row>
            <Col xs={6} md={4}>
              <FormGroup bsSize="small" controlId="cvc">
                <ControlLabel style={labelStyle}>CVC</ControlLabel>
                <FormControl value={this.state.cvc} 
                  autoComplete="cc-csc"
                  onChange={this.handleValueChange.bind(this, "cvc")} 
                  type="text" />
              </FormGroup>
            </Col>
            <Col xs={6} md={4}>
              <span className={styles.cvcHelper}><a>What is CVC?</a></span>
            </Col>
          </Row>
        </Form>
        <Button disabled={!this.state.formFilled || this.state.isSubmitting} 
          onClick={this.handleConfirm}
          className={styles.submitButton} bsSize="large" block>
          <div hidden={!this.state.isSubmitting} className={styles.submitSpinner}>
            <BaseSpinner />
          </div>
          <Glyphicon glyph="lock" />
          {' '}
          BOOK SECURELY
        </Button>
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
