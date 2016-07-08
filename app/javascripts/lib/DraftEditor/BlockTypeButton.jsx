"use strict"

import React from "react"
import _ from "lodash"

import GhostButton from "lib/GhostButton"
import FontAwesomeButton from "lib/FontAwesomeButton"

import styles from "lib/DraftEditor/BlockTypeButton.scss"

export default class BlockTypeButton extends React.Component {
  
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
    
    let buttonContent = do {
      if (_.isEmpty(this.props.type.label)) {
        <FontAwesomeButton 
          icon={this.props.type.icon} 
          onMouseDown={this.onToggle}
          inverse={this.props.active}
        />
      } else {
        <GhostButton 
          onMouseDown={this.onToggle}
          inverse={this.props.active}
        >{this.props.type.label}</GhostButton>
      }
    }
    
    return buttonContent;
    
  }
}

BlockTypeButton.propTypes = {
  type: React.PropTypes.object.isRequired,
  onToggle: React.PropTypes.func.isRequired,
  active: React.PropTypes.bool
};

BlockTypeButton.defaultProps = {
  active: false
};

