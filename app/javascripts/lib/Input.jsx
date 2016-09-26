import React, { PropTypes } from "react";
import _ from "lodash";
import { FormGroup, InputGroup, FormControl } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

import styles from "lib/Input.scss";

// prop types for Input component
const propTypes = { 
  type: PropTypes.string,

  onChange: PropTypes.func,
  
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  validationState: PropTypes.string,
  autoComplete: PropTypes.string,
  focusText: PropTypes.string,
  
  shrink: PropTypes.bool,
  disabled: PropTypes.bool
};

// default props for Input component
const defaultProps = {
  type: "text",
  
  onChange: function() {},

  initialValue: "",
  placeholder: "",
  icon: "",
  label: "",
  validationState: null,
  autoComplete: "",
  focusText: "",
  
  shrink: false,
  disabled: false
};

/**
 * @class
 * @extends {React.Component}
 */
export default class Input extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      value: this.props.initialValue,
      focused: false
    };
  }
  
  /**
   * @private
   * Handler for when the input emits the 'change' event.
   * 
   * @param  {Object} evt the 'change' event object.
   */
  _onChange = (evt) => {
    let newValue = evt.target.value
    ,   name = evt.target.name;
    
    this.setState({
      value: newValue
    });
    
    this.props.onChange(newValue, name);
  };
  
  /**
   * @private
   * Handler for when the input emits the 'onfocus' event.
   */
  _onFocus = () => {
    this.setState({
      focused: true
    });
  };
  
  /**
   * @private
   * Handler for when the input emits the 'onblur' event.
   */
  _onBlur = () => {
    this.setState({
      focused: false
    });
  };
  
  /**
   * Returns the input value.
   * 
   * @return {String}
   */
  getValue() {
    return this.state.value;
  }
  
  /**
   * Resets the base input state.
   */
  clear() {
    this.setState({
      value: this.props.initialValue,
      focused: false
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let addonClassname
    ,   addonContent
    ,   classNames = [ styles.input ]
    ,   focusTextStyle = { maxHeight: this.state.focused ? "90px" : "" };
    
    const { type, placeholder, icon, label, validationState, autoComplete, focusText, className,
            shrink, disabled } = this.props;
    
    addonClassname = do {
      if (shrink) {
        styles.addonContentShrink;
      } else {
        styles.addonContent;
      }
    }

    addonContent = do {
      if (!_.isEmpty(icon)) {
        <InputGroup.Addon className={addonClassname}>
          <FontAwesome
            name={icon}
            fixedWidth={true}
          />
          &nbsp; 
          <label>{label}</label>
        </InputGroup.Addon>
      } else {
        <InputGroup.Addon className={addonClassname}>
          <label>{label}</label>
        </InputGroup.Addon>
      }
    }

    if (!_.isEmpty(className)) {
      // push in additional className 
      classNames.push(className);
    }
    
    return (
      <FormGroup 
        className={classNames.join(' ')} 
        validationState={validationState}
      >
        <InputGroup>
          {addonContent}
          <FormControl 
            type={type}
            value={this.props.value ? this.props.value : this.state.value}
            onChange={this._onChange}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            placeholder={this.props.placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
          />
        </InputGroup>
        <div 
          hidden={_.isEmpty(focusText)} 
          className={styles.focusContentContainer} 
          style={focusTextStyle}
        >
          <div className={styles.focusContent}>
            {focusText}
          </div>
        </div>
      </FormGroup>
      
    );
    
  }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;