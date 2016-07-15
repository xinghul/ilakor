"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import Icon from "lib/Icon"

import styles from "lib/SidePanel.scss"

export default class SidePanel extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      collapsed: false
    };
  }
  
  /**
   * @private
   * Handler for when the collapse button is clicked.
   */
  _onCollapseButtonClick = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  
  /**
   * Creates the JSX for the collapse button if enabled.
   * 
   * @return {JSX}
   */
  createCollapseButtonJsx() {
    
    if (!this.props.collapsible) {
      return null;
    }
    
    let iconName = do {
      if (this.state.collapsed) {
        "chevron-right";
      } else {
        "chevron-left"
      }
    }
    
    return (
      <div className={styles.collapseButton} onClick={this._onCollapseButtonClick}>
        <Icon name={iconName} hoverable={true} cover={true} />
      </div>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let style = {
      position: this.props.position,
      left: this.state.collapsed ? "-190px" : ""
    };
    
    return (
      <div style={style} className={styles.sidePanel}>
        {this.createCollapseButtonJsx()}
        <div className={styles.panelContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

SidePanel.propTypes = {
  position: React.PropTypes.oneOf(["absolute", "fixed", "relative"]),
  collapsible: React.PropTypes.bool
};

SidePanel.defaultProps = {
  position: "relative",
  collapsible: false
};
