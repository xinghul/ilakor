"use strict";

import React from "react"
import _ from "underscore"
import { Button, Form, SplitButton, MenuItem, Modal } from "react-bootstrap"

import GhostButton from "lib/GhostButton.jsx"
import EmailInput from "./AuthApp/EmailInput.jsx"
import UsernameInput from "./AuthApp/UsernameInput.jsx"
import PasswordInput from "./AuthApp/PasswordInput.jsx"

import AuthStore from "stores/AuthStore"
import AuthActions from "actions/AuthActions"

function getStateFromStores() {
  return {
    isModalOpen: AuthStore.isModalOpen(),
    isSignUp: AuthStore.isSignUp(),
    user: AuthStore.getUser()
  };
}

export default class AuthApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this._onChange = this._onChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSignupClick = this.handleSignupClick.bind(this);
    
    this.state = {
      username: "",
      email: "",
      password: ""
    };
  }

  toggleMode() {
    AuthActions.toggleMode();
  }
  
  toggleModal() {
    AuthActions.toggleModal();
  }
  
  handleLoginClick() {
    let self = this;
    
    // handle log in
    AuthActions.userLogIn({

      email: this.state.email,
      password: this.state.password

    }).then(function() {
      AuthActions.toggleModal();
    }).catch(function(err) {
      console.log(err);

      self.setState(err);
    });
  }
  
  handleSignupClick() {
    let self = this;
    
    AuthActions.userSignUp({

      username: this.state.username,
      email: this.state.email,
      password: this.state.password

    }).then(function() {
      AuthActions.toggleModal();
    }).catch(function(err) {
      console.log(err);

      self.setState(err);
    });
  }
  
  _onChange() {
    this.setState(getStateFromStores());
  }
  
  handleEmailChange(newValue) {
    this.setState({
      email: newValue
    });
  }
  
  handlePasswordChange(newValue) {
    this.setState({
      password: newValue
    });
  }
  
  handleUsernameChange(newValue) {
    this.setState({
      username: newValue
    });
  }

  handleLogOut() {
    AuthActions.removeUserFromCookie();
  }

  componentDidMount() {
    AuthStore.addChangeListener(this._onChange);
    
    AuthActions.logInFromCookie();
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }
  
  createModalBodyLogin() {
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.password);
                   
    let socialLoginArea = (
      <div>
        login with
        <Button><a href="/auth/facebook">Facebook</a></Button>
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
    var authArea;
    var toggleModeMessage;
    var socialLoginArea;
    
    if (this.state.user && this.state.user.username) {
      var title = "Hello, " + this.state.user.username;
      
      authArea =
        <SplitButton id="sign-in" title={title} bsStyle="default" pullRight>
          <MenuItem>My Account</MenuItem>
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
};