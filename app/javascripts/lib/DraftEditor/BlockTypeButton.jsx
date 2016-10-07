import React from "react";
import _ from "lodash";

import GhostButton from "lib/GhostButton";
import IconButton from "lib/IconButton";

import styles from "lib/DraftEditor/BlockTypeButton.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class BlockTypeButton extends React.Component {
  
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
    
    let buttonContent = do {
      if (_.isEmpty(this.props.type.label)) {
        <IconButton 
          icon={this.props.type.icon} 
          onMouseDown={this.onToggle}
          theme={theme}
        />
      } else {
        <GhostButton 
          theme={theme}
          onMouseDown={this.onToggle}
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

