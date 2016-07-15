"use strict"

import React from "react"
import FontAwesome from "react-fontawesome"

import GhostButton from "lib/GhostButton"

import styles from "lib/IconButton.scss"

export default class IconButton extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <GhostButton {...this.props} onClick={this.props.onClick} onMouseDown={this.props.onMouseDown}>
        <FontAwesome
          name={this.props.icon}
          inverse={this.props.inverse}
        />
      </GhostButton>
    );
    
  }
}

IconButton.propTypes = {
  icon: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onMouseDown: React.PropTypes.func
};

IconButton.defaultProps = {
  icon: "circle",
  inverse: false,
  onClick: function() {},
  onMouseDown: function() {}
};