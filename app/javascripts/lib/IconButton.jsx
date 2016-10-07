import React from "react";
import FontAwesome from "react-fontawesome";
import _ from "lodash";

import GhostButton from "lib/GhostButton";

import styles from "lib/IconButton.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class IconButton extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { icon, theme, onClick, onMouseDown } = this.props;
    
    return (
      <GhostButton theme={theme} onClick={onClick} onMouseDown={onMouseDown}>
        <FontAwesome
          name={icon}
        />
      </GhostButton>
    );
    
  }
}

IconButton.propTypes = {
  icon: React.PropTypes.string,
  theme: React.PropTypes.string,
  onClick: React.PropTypes.func,
  onMouseDown: React.PropTypes.func
};

IconButton.defaultProps = {
  icon: "circle",
  theme: "black",
  onClick: () => {},
  onMouseDown: () => {}
};