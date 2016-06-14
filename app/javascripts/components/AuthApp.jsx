"use strict";

import React from "react"
import _ from "lodash"
import { Button, Alert, SplitButton, MenuItem, Modal } from "react-bootstrap"

import GhostButton from "lib/GhostButton"
import SubmitButton from "lib/SubmitButton"
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
      
      isLoggingIn: false,
      isSigningUp: false,
      showErrorAlert: false,
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
      showErrorAlert: false,
      errorMessage: "",
      
      isSignUp: !this.state.isSignUp
    });
  };
  
  toggleModal = () => {
    this.setState({
      showErrorAlert: false,
      errorMessage: "",
      
      isModalOpen: !this.state.isModalOpen
    });
  };
  
  handleLoginClick = () => {
    
    this.setState({
      isLoggingIn: true
    });
    
    AuthActions.userLogIn({

      email: this.state.email,
      password: this.state.password

    }).then(() => {
      this.toggleModal();
    }).catch((err) => {
      console.log(err);
      
      this.setState({
        showErrorAlert: true,
        errorMessage: err.body.message
      });
    }).finally(() => {
      this.setState({
        isLoggingIn: false
      });
    });
  };
  
  handleSignupClick = () => {
    
    this.setState({
      isSigningUp: true
    });
    
    AuthActions.userSignUp({

      username: this.state.username,
      email: this.state.email,
      password: this.state.password

    }).then(() => {
      this.toggleModal();
    }).catch((err) => {
      console.log(err);
      
      this.setState({
        showErrorAlert: true,
        errorMessage: err.body.message
      });
    }).finally(() => {
      this.setState({
        isSigningUp: false
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
  
  handleAlertDismiss = () => {
    this.setState({
      showErrorAlert: false
    });
  };

  handleLogOut() {
    AuthActions.removeUserFromCookie();
  }

  createModalBodyLogin() {
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.password) || 
                   this.state.isLoggingIn;
    
    let buttonWrapperStyle = {
      textAlign: "center"
    };
          
    let linkStyle = {
      color: "white",
      fontSize: "14px"
    };
                   
    let socialLoginArea = (
      <div style={buttonWrapperStyle}>
        <Button disabled={this.state.isLoggingIn} className={styles.loginBtn + ' ' + styles.loginBtnFacebook}>
          <a style={linkStyle} href="/auth/facebook">Login with Facebook</a>
        </Button>
      </div>
    );
    
    return (
      <div>
        <EmailInput value={this.state.email} disabled={this.state.isLoggingIn} isRegister={false} handleChange={this.handleEmailChange} />
        <PasswordInput value={this.state.password} disabled={this.state.isLoggingIn} isRegister={false} handleChange={this.handlePasswordChange} />
        <SubmitButton
          disabled={disabled}
          handleSubmit={this.handleLoginClick}
          isSubmitting={this.state.isLoggingIn}
          bsStyle="success"
        >Log in</SubmitButton>
        <div className={styles.divider}>or</div>
        {socialLoginArea}      
      </div>
    );
  }
  
  createModalBodySignup() {
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.username) ||
                   _.isEmpty(this.state.password) ||
                   this.state.isSigningUp;

    return (
      <div>
        <EmailInput value={this.state.email} disabled={this.state.isSigningUp} isRegister={true} handleChange={this.handleEmailChange} />
        <UsernameInput value={this.state.username} disabled={this.state.isSigningUp} isRegister={true} handleChange={this.handleUsernameChange} />
        <PasswordInput value={this.state.password} disabled={this.state.isSigningUp} isRegister={true} handleChange={this.handlePasswordChange} />
        <SubmitButton
          disabled={disabled}
          handleSubmit={this.handleSignupClick}
          isSubmitting={this.state.isSigningUp}
          bsStyle="success"
        >Sign up</SubmitButton>
      </div>
    );
  }

  render() {
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
        <SplitButton id="sign-in" title={title} bsStyle="default" pullRight>
          <MenuItem href="#/account">My Account</MenuItem>
          <MenuItem divider />
          <MenuItem onSelect={this.handleLogOut}>Log out</MenuItem>
        </SplitButton>
        
    } else {
      
      
      authArea = 
        <div>
          <GhostButton onClick={this.toggleModal}>Sign in</GhostButton> 
        </div>
    }
    
    let toggleModeMessage = (
      <span hidden={this.state.isLoggingIn || this.state.isSigningUp} className="pull-left">
        {do {
          if (this.state.isSignUp) {
            <div>Already have an account? <a onClick={this.toggleMode}>Log In</a></div>
          } else {
            <div>New here? <a onClick={this.toggleMode}>Sign Up</a></div>
          }
        }}
      </span>
    );
    
    let alertStyle = {
      opacity: this.state.showErrorAlert ? "1" : "",
      maxHeight: this.state.showErrorAlert ? "52px" : "",
      marginBottom: this.state.showErrorAlert ? "20px" : ""
    };
    
    let errorAlert = (
      <div style={alertStyle} className={styles.errorAlert}>
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
          <p>{this.state.errorMessage}</p>
        </Alert>
      </div>
    );
    
    let authModal = (
      <Modal show={this.state.isModalOpen} onHide={this.toggleModal}>
        <Modal.Header>
          <Modal.Title className={styles.modalTitle}>{this.state.isSignUp ? "Sign up" : "Log In"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorAlert}
          {this.state.isSignUp ? this.createModalBodySignup()
                               : this.createModalBodyLogin()}
        </Modal.Body>
        <Modal.Footer>
          {toggleModeMessage}
          <Button onClick={this.toggleModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
    
    return (
      <div className={styles.authApp}>
        {authModal}
        {authArea}
      </div>
    );
  }
}
