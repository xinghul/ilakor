"use strict"

import React from "react"
import _ from "lodash"

import IconButton from "lib/IconButton"

import styles from "lib/DraftEditor/InlineStyleButton.scss"

export default class InlineStyleButton extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @private
   * Event handler for IconButton's 'onMouseDown' event.
   * 
   * @param  {Object} evt the emitted event.
   */
  onToggle = (evt) => {
    
    // ensures the focus is on editor all the time
    evt.preventDefault();
    
    this.props.onToggle();
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    let theme = "black";
    
    if (this.props.active) {
      theme = "gold";
    }
    
    return (
      <IconButton 
        icon={this.props.icon} 
        onMouseDown={this.onToggle}
        theme={theme}
      />
    );
  }
}

InlineStyleButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  onToggle: React.PropTypes.func.isRequired,
  active: React.PropTypes.bool
};

InlineStyleButton.defaultProps = {
  active: false
};

