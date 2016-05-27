"use strict";

import React from "react"
import _ from "lodash"
import { Button, Form, SplitButton, MenuItem, Modal } from "react-bootstrap"

import GhostButton from "lib/GhostButton"
import EmailInput from "./AuthApp/EmailInput"
import UsernameInput from "./AuthApp/UsernameInput"
import PasswordInput from "./AuthApp/PasswordInput"

import AuthStore from "stores/AuthStore"
import AuthActions from "actions/AuthActions"

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
      isSignUp: false,
      
      username: "",
      email: "",
      password: "",
      
      errorMessage: ""
    };
  }
  
  componentDidMount() {
    AuthStore.addChangeListener(this._onChange);
    
    AuthActions.logInFromCookie();
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(getStateFromStores());
  };

  toggleMode = () => {
    this.setState({
      isSignUp: !this.state.isSignUp
    });
  };
  
  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  };
  
  handleLoginClick = () => {
    let self = this;
    
    // handle log in
    AuthActions.userLogIn({

      email: this.state.email,
      password: this.state.password

    }).then(function() {
      AuthActions.toggleModal();
    }).catch((err) => {
      console.log(err);
      
      this.setState({
        errorMessage: err.body.message
      });
    });
  };
  
  handleSignupClick = () => {
    let self = this;
    
    AuthActions.userSignUp({

      username: this.state.username,
      email: this.state.email,
      password: this.state.password

    }).then(function() {
      AuthActions.toggleModal();
    }).catch((err) => {
      console.log(err);
      
      this.setState({
        errorMessage: err.body.message
      });
    });
  };
  
  handleEmailChange = (newValue) => {
    this.setState({
      email: newValue
    });
  };
  
  handlePasswordChange = (newValue) => {
    this.setState({
      password: newValue
    });
  };
  
  handleUsernameChange = (newValue) => {
    this.setState({
      username: newValue
    });
  };

  handleLogOut() {
    AuthActions.removeUserFromCookie();
  }

  createModalBodyLogin() {
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.password);
    
    let buttonWrapperStyle = {
      textAlign: "center"
    };
          
    let linkStyle = {
      color: "white",
      fontSize: "14px"
    };
                   
    let socialLoginArea = (
      <div style={buttonWrapperStyle}>
        <Button className={styles.loginBtn + ' ' + styles.loginBtnFacebook}>
          <a style={linkStyle} href="/auth/facebook">Login with Facebook</a>
        </Button>
      </div>
    );
    
    return (
      <div>
        <EmailInput handleChange={this.handleEmailChange} />
        <PasswordInput handleChange={this.handlePasswordChange} />
        <Button disabled={disabled} block bsStyle="success" onClick={this.handleLoginClick}>Log in</Button>
        {socialLoginArea}      
      </div>
    );
  }
  
  createModalBodySignup() {
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.username) ||
                   _.isEmpty(this.state.password);

    return (
      <div>
        <EmailInput handleChange={this.handleEmailChange} />
        <UsernameInput handleChange={this.handleUsernameChange} />
        <PasswordInput handleChange={this.handlePasswordChange} />
        <Button disabled={disabled} block bsStyle="success" onClick={this.handleSignupClick}>Sign up</Button>
      </div>
    );
  }

  render() {
    let authArea;
    let toggleModeMessage;
    let socialLoginArea;
    let user = this.state.user;

    if (user && user._id) {
      let username = do {
        if (user.local) {
          user.local.username
        } else if (user.facebook) {
          user.facebook.nickname
        }
      }
      
      let title = "Hello, " + username;
      
      authArea =
        <SplitButton id="sign-in" title={title} bsStyle="default" pullRight>
          <MenuItem href="#/account">My Account</MenuItem>
          <MenuItem divider />
          <MenuItem onSelect={this.handleLogOut}>Log out</MenuItem>
        </SplitButton>
        
    } else {
      if (this.state.isSignUp) {
        toggleModeMessage =
          <span className="pull-left">
            Already have an account? <a onClick={this.toggleMode}>Log In</a>
          </span>
      } else {
        toggleModeMessage =
          <span className="pull-left">
            New here? <a onClick={this.toggleMode}>Sign Up</a>
          </span>
      
      }
      
      authArea = 
        <div>
          <GhostButton onClick={this.toggleModal}>Sign in</GhostButton> 
          
          <Modal show={this.state.isModalOpen} onHide={this.toggleModal}>
            <Modal.Header>
              <Modal.Title>{this.state.isSignUp ? "Sign up" : "Log In"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.isSignUp ? this.createModalBodySignup()
                                   : this.createModalBodyLogin()}
            </Modal.Body>
            <Modal.Footer>
              {toggleModeMessage}
              <Button onClick={this.toggleModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
    }

    return (
      <div id="userArea">
        {authArea}
      </div>
    );
  }
}
