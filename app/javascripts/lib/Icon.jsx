import React from "react";
import FontAwesome from "react-fontawesome";

import styles from "lib/Icon.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class Icon extends React.Component {
  
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
    
    const { className, name, size, hoverable } = this.props;
    
    let classNames = [ styles.icon ];
    
    if (!_.isEmpty(className)) {
      classNames.push(className);      
    }
    
    let style = {
      opacity: hoverable ? "0.6" : "",
      cursor: hoverable ? "pointer" : ""
    };
    
    return (
      <FontAwesome
        className={classNames.join(' ')}
        style={style}
        name={name}
        size={size}
      />
    );
  }
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired,
  
  size: React.PropTypes.oneOf(["lg", "2x", "3x", "4x", "5x"]),
  hoverable: React.PropTypes.bool
}

Icon.defaultProps = {
  size: null,
  hoverable: false
}
