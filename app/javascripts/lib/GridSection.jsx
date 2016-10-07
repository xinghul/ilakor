import React from "react"
import _ from "lodash"

import styles from "lib/GridSection.scss"

/**
 * @class
 * @extends {React.Component}
 */
export default class GridSection extends React.Component {
  
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
    
    const { children, className, title } = this.props;
    
    let classNames = [ styles.gridSection ];
    
    if (!_.isEmpty(className)) {
      classNames.push(className);
    }
    
    return (
      <div className={classNames.join(' ')}>
        <div hidden={_.isEmpty(title)} className={styles.gridTitle}>{title}</div>
        {children}
      </div>
    );
  }
}

GridSection.propTypes = {
  title: React.PropTypes.string
};

GridSection.defaultProps = {
  title: ""
};

