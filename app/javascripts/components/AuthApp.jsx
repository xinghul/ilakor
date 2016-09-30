import React from "react";
import _ from "lodash";
import invariant from "invariant";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Modal } from "react-bootstrap";

import LoginApp from "./AuthApp/LoginApp";
import SignupApp from "./AuthApp/SignupApp";
import ForgotPasswordApp from "./AuthApp/ForgotPasswordApp";

import GhostButton from "lib/GhostButton";
import SubmitButton from "lib/SubmitButton";
import SocialButton from "lib/SocialButton";
import EmailInput from "./AuthApp/EmailInput";
import UsernameInput from "./AuthApp/UsernameInput";
import PasswordInput from "./AuthApp/PasswordInput";

import AuthStore from "stores/AuthStore";
import AuthAction from "actions/AuthAction";

import styles from "components/AuthApp.scss";

/**
 * @private 
 *
 * Get new state from subscribed stores.
 *
 * @return {Object}
 */
function getStateFromStores() {
  return {
    isModalOpen: AuthStore.getIsModalOpen()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class AuthApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      isModalOpen: AuthStore.getIsModalOpen(),
      
      step: 1
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    AuthStore.subscribe(this._onChange);
  }

  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AuthStore.unsubscribe(this._onChange);
  }

  /**
   * @private
   *
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @private
   * 
   * Hides the auth modal.
   */
  _hideModal = () => {
    AuthAction.hideModal().then(() => {
      // reset the step
      this.setState({
        step: 1
      });
    });
  };

  /**
   * @private
   *
   * Sets the step for the auth modal local content.
   * 1. Login, 2. Signup, 3. Forgot password.
   * 
   * @param  {Number} step the step to set.
   */
  _setStep = (step) => {
    invariant(_.isInteger(step) && _.inRange(step, 1, 4), `_setStep(step) expects 'step' to be integer from 1 to 3, but got '${step}'.`);
    
    this.setState({
      step: step
    });
  };
  
  /**
   * Renders the local auth area.
   *
   * @return {JSX} the jsx created.
   */
  renderLocalContent() {
    let localContent = do {
      if (this.state.step === 1) {
        <LoginApp key="loginApp" setStep={this._setStep} />
      } else if (this.state.step === 2) {
        <SignupApp key="signupApp" setStep={this._setStep} />
      } else if (this.state.step === 3) {
        <ForgotPasswordApp key="forgotPasswordApp" setStep={this._setStep} />
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
  
  /**
   * Renders the social auth area.
   *
   * @return {JSX} the jsx created.
   */
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
    
    
  /**
   * @inheritdoc
   */
  render() {
        
    return (
      <Modal className={styles.authApp} show={this.state.isModalOpen} onHide={this._hideModal}>
        <Modal.Body>
          {this.renderLocalContent()}
          <div className={styles.divider}>
            <div className={styles.dividerContent}>or</div>
          </div>
          {this.renderSocialContent()}      
        </Modal.Body>
        <Modal.Footer>
          <GhostButton theme="black" onClick={this._hideModal}>Close</GhostButton>
        </Modal.Footer>
      </Modal>
    );
  }
}
