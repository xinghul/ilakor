"use strict"

import React from "react"
import FontAwesome from "react-fontawesome"
import _ from "lodash"

import GhostButton from "lib/GhostButton"

import styles from "lib/IconButton.scss"

export default class IconButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    return (
      <GhostButton onClick={this.props.onClick} onMouseDown={this.props.onMouseDown}>
        <FontAwesome
          name={this.props.icon}
        />
      </GhostButton>
    );
    
  }
}

IconButton.propTypes = {
  icon: React.PropTypes.string,
  onClick: React.PropTypes.func,
  onMouseDown: React.PropTypes.func
};

IconButton.defaultProps = {
  icon: "circle",
  onClick: function() {},
  onMouseDown: function() {}
};