import React from "react"
import { Button, Form, SplitButton, MenuItem, Modal } from "react-bootstrap"

+function(undefined) {
"use strict";

var AuthStore   = require("../stores/AuthStore")
,   AuthActions = require("../actions/AuthActions");

const UsernameInput = require("./AuthApp/UsernameInput.react")
,     EmailInput    = require("./AuthApp/EmailInput.react")
,     PasswordInput = require("./AuthApp/PasswordInput.react");

function getStateFromStores() {
  return {
    isModalOpen: AuthStore.isModalOpen(),
    isSignUp: AuthStore.isSignUp(),
    username: AuthStore.getUsernameInput(),
    email: AuthStore.getEmailInput(),
    password: AuthStore.getPasswordInput(),
    user: AuthStore.getUser()
  };
}

var AuthApp = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  toggleMode: function() {
    AuthActions.toggleMode();
  },
  
  toggleModal: function() {
    AuthActions.toggleModal();
  },

  handleSubmit: function() {
    var self = this;
    if (this.state.isSignUp) {
      if (this.state.username && this.state.email && this.state.password) {
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
      } else {
        this.setState({
          message: "Missing fields"
        });
      }

    } else {
      // handle log in
      if (this.state.email && this.state.password) {
        AuthActions.userLogIn({

          email: this.state.email,
          password: this.state.password

        }).then(function() {
          AuthActions.toggleModal();
        }).catch(function(err) {
          console.log(err);

          self.setState(err);
        });
      } else {
        this.setState({
          message: "Missing fields"
        });
      }
    }

  },

  handleLogOut: function() {
    AuthActions.removeUserFromCookie();
  },

  componentDidMount: function() {
    AuthStore.addChangeListener(this._onChange);
    
    AuthActions.logInFromCookie();
  },

  componentWillUnmount: function() {
    AuthStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    // XXX use store to set them seperately.
    this.setState({
      usernameError: null,
      emailError: null,
      passwordError: null,
      message: null
    });
    
    this.setState(getStateFromStores());
  },

  render: function() {
    var authArea;
    var toggleModeMessage;
    var socialLoginArea;
    
    if (this.state.user.username) {
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
            Already have an account? <a onClick={this.toggleMode}>Sign In</a>
          </span>
      } else {
        toggleModeMessage =
          <span className="pull-left">
            New here? <a onClick={this.toggleMode}>Sign Up</a>
          </span>
          
        socialLoginArea = 
          <div>
            login with
            <Button><a href="/auth/facebook">Facebook</a></Button>
            <Button>Google</Button>
            <Button>Twitter</Button>
          </div>
      }
      
      authArea = 
        <div>
          <Button onClick={this.toggleModal}>Sign in</Button> 
          
          <Modal show={this.state.isModalOpen} onHide={this.toggleModal}>
            <Modal.Header>
              <Modal.Title>{this.state.isSignUp ? "Sign up" : "Sign In"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.isSignUp ? <UsernameInput usernameError={this.state.usernameError}/> : null}
              <EmailInput emailError={this.state.emailError}/>
              <PasswordInput passwordError={this.state.passwordError}/>
              <div style={{color: "red"}}>{this.state.message}</div>
              <Button block bsStyle="success" onClick={this.handleSubmit}>Sign in</Button>
              {socialLoginArea}
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
});

module.exports = AuthApp;

}();
