"use strict"

import React from "react"
import _ from "lodash"

import FontAwesomeButton from "lib/FontAwesomeButton"

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
   * Event handler for FontAwesomeButton's 'onMouseDown' event.
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
    
    return (
      <FontAwesomeButton 
        icon={this.props.icon} 
        onMouseDown={this.onToggle}
        inverse={this.props.active}
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

