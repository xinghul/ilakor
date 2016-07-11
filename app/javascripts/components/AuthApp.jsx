"use strict";

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Form, Alert, SplitButton, MenuItem, Modal } from "react-bootstrap"
import { hashHistory } from "react-router"

import LoginApp from "./AuthApp/LoginApp"
import SignupApp from "./AuthApp/SignupApp"
import ForgotPasswordApp from "./AuthApp/ForgotPasswordApp"

import GhostButton from "lib/GhostButton"
import SubmitButton from "lib/SubmitButton"
import SocialButton from "lib/SocialButton"
import EmailInput from "./AuthApp/EmailInput"
import UsernameInput from "./AuthApp/UsernameInput"
import PasswordInput from "./AuthApp/PasswordInput"

import AuthStore from "stores/AuthStore"
import AuthAction from "actions/AuthAction"

import styles from "components/AuthApp.scss"

function getStateFromStores() {
  return {
    user: AuthStore.getUser()
  };
}

export default class AuthApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      user: AuthStore.getUser(),
      
      isModalOpen: false,
      step: 1
    };
  }
  
  componentDidMount() {
    AuthStore.addChangeListener(this._onChange);
    
    AuthAction.logInFromCookie();
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(getStateFromStores());
  };

  _toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      step: 1
    });
  };
  
  _setStep = (step) => {
    invariant(_.isInteger(step) && _.inRange(step, 1, 4), `_setStep(step) expects 'step' to be integer from 1 to 3, but got '${step}'.`);
    
    this.setState({
      step: step
    });
  };
  
  renderAuthArea() {
    let authArea;
    let user = this.state.user;

    if (user && user._id) {
      let username = do {
        if (user.username) {
          user.username
        } else if (user.facebook) {
          user.facebook.nickname
        }
      }
      
      let title = "Hello, " + username;
      
      authArea =
        <SplitButton id="sign-in" title={title} pullRight>
          <MenuItem href="#/account">My Account</MenuItem>
          <MenuItem divider />
          <MenuItem onSelect={this.handleLogOut}>Log out</MenuItem>
        </SplitButton>
        
    } else {
      
      
      authArea = 
        <div>
          <GhostButton onClick={this._toggleModal}>Sign in</GhostButton> 
        </div>
    }
    
    return authArea;
  }
  
  renderLocalContent() {
    let localContent = do {
      if (this.state.step === 1) {
        <LoginApp key="loginApp" toggleModal={this._toggleModal} setStep={this._setStep} />
      } else if (this.state.step === 2) {
        <SignupApp key="signupApp" toggleModal={this._toggleModal} setStep={this._setStep} />
      } else if (this.state.step === 3) {
        <ForgotPasswordApp key="forgotPasswordApp" toggleModal={this._toggleModal} setStep={this._setStep} />
      }
    }
    
    return (
      <ReactCSSTransitionGroup transitionName="auth" 
        transitionEnterTimeout={300} 
        transitionLeaveTimeout={300}
        className={styles.localContent}
      >
        {localContent}
      </ReactCSSTransitionGroup>
    );
  }
  
  renderSocialContent() {
    return (
      <div className={styles.socialContent}>
        <SocialButton 
          type="facebook"
        />
        <SocialButton 
         type="googleplus"
        />
        <SocialButton 
         type="twitter"
        />
        <SocialButton 
         type="linkedin"
        />
      </div>
    );
  }
    
  handleLogOut() {
    AuthAction.removeUserFromCookie();
  }

  render() {
        
    let authModal = (
      <Modal className={styles.authAppModal} show={this.state.isModalOpen} onHide={this._toggleModal}>
        <Modal.Body>
          {this.renderLocalContent()}
          <div className={styles.divider}>
            <div className={styles.dividerContent}>or</div>
          </div>
          {this.renderSocialContent()}      
        </Modal.Body>
        <Modal.Footer>
          <GhostButton theme="black" onClick={this._toggleModal}>Close</GhostButton>
        </Modal.Footer>
      </Modal>
    );
    
    return (
      <div className={styles.authApp}>
        {authModal}
        {this.renderAuthArea()}
      </div>
    );
  }
}
