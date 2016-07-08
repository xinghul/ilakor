"use strict"

import React from "react"
import FontAwesome from "react-fontawesome"

import GhostButton from "lib/GhostButton"

import styles from "lib/FontAwesomeButton.scss"

export default class FontAwesomeButton extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <GhostButton inverse={this.props.inverse} onClick={this.props.onClick} onMouseDown={this.props.onMouseDown}>
        <FontAwesome
          name={this.props.icon}
          inverse={this.props.inverse}
        />
      </GhostButton>
    );
    
  }
}

FontAwesomeButton.propTypes = {
  icon: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onMouseDown: React.PropTypes.func
};

FontAwesomeButton.defaultProps = {
  icon: "circle",
  inverse: false,
  onClick: function() {},
  onMouseDown: function() {}
};