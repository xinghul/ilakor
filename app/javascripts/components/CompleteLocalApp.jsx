"use strict"

import React from "react"
import _ from "lodash"
import { hashHistory } from "react-router"

import styles from "components/CompleteLocalApp.scss"

import AuthStore from "stores/AuthStore"
import AuthActions from "actions/AuthActions"

import SubmitButton from "lib/SubmitButton"
import EmailInput from "components/AuthApp/EmailInput"
import UsernameInput from "components/AuthApp/UsernameInput"
import PasswordInput from "components/AuthApp/PasswordInput"

export default class CompleteLocalApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      user: AuthStore.getUser(),
      
      email: "",
      username: "",
      password: "",
      isSubmitting: false
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
    let user = AuthStore.getUser();

    if (!_.isEmpty(user.email)) {
      this.setState({
        user: user,
        email: user.email,
        username: user.username
      });  
    } else {
      this.setState({
        user: user
      });
    }
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
  
  handleUpdateClick = () => {
    let info = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    };
    
    this.setState({
      isSubmitting: true
    });
    
    AuthActions.updateUserInfo(this.state.user._id, info)
      .then(() => {
        hashHistory.push("/");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

  render() {
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.username) || 
                   _.isEmpty(this.state.password) ||
                   this.state.isSubmitting;

    return (
      <div className={styles.completeLocalApp}>
        <div className={styles.mask} />
        <div className={styles.formContent}>
          <label className={styles.formTitle}>Update info</label>
          <EmailInput value={this.state.email} disabled={this.state.isSubmitting} isRegister={true} handleChange={this.handleEmailChange} />
          <UsernameInput value={this.state.username} disabled={this.state.isSubmitting} isRegister={true} handleChange={this.handleUsernameChange} />
          <PasswordInput value={this.state.password} disabled={this.state.isSubmitting} isRegister={true} handleChange={this.handlePasswordChange} />
          <SubmitButton
            disabled={disabled}
            handleSubmit={this.handleUpdateClick}
            isSubmitting={this.state.isSubmitting}
            bsStyle="success"
          >Update</SubmitButton>
        </div>
      </div>
    );
    
  }

}
