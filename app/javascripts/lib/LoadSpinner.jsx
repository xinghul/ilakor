import React from "react";
import _ from "lodash";
import Sonic from "sonic.js";

import styles from "lib/LoadSpinner.scss";

const SONIC_LOADER_ID = "sonicLoader";

/**
* @class
* @extends {React.Component}
*/
export default class LoadSpinner extends React.Component {
  /**
  * @inheritdoc
  */
  constructor(props) {
    super(props);
    
    this._loaderId = _.uniqueId(SONIC_LOADER_ID);
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    
    const { size, fill } = this.props;
    
    let square = new window.Sonic({
      
      width: size,
    	height: size,

    	stepsPerFrame: 3,
    	trailLength: 0.6,
    	pointDistance: 0.01,
    	fps: 40,

    	backgroundColor: "transparent",
    	fillColor: fill,

    	path: [
    		["arc", size / 2, size / 2, size * 0.3, 0, 360]
    	],

    	step: function(point, index, frame) {

    		let sizeMultiplier = 3;
    		
    		this._.beginPath();
    		this._.moveTo(point.x, point.y);
    		this._.arc(
    			point.x, point.y,
    			index * sizeMultiplier, 0,
    			Math.PI*2, false
    		);
    		this._.closePath();
    		this._.fill();

    	}
      
    });
    
    square.play();
    
    document.getElementById(this._loaderId).appendChild(square.canvas);
  }
  
  /**
  * @inheritdoc
  */
  render() {
    
    const { hidden, text } = this.props;
    
    let classNames = [ styles.loadSpinner ];
    
    // push in additional className 
    classNames.push(this.props.className);
    
    let style = {
      display: hidden ? "none" : "block"
    };
    
    let textStyle = {
      display: _.isEmpty(text) ? "none" : "inline-block"
    };
    
    return (
      
      <div className={classNames.join(' ')} style={style}>
        <div id={this._loaderId}>
          <div style={textStyle} className={styles.spinnerText}>{text}</div>
        </div>
      </div>
    );
  }
}

LoadSpinner.propTypes = {
  size: React.PropTypes.number,
  fill: React.PropTypes.string,
  hidden: React.PropTypes.bool,
  text: React.PropTypes.string
};

LoadSpinner.defaultProps = {
  size: 100,
  fill: "gray",
  hidden: false,
  text: ""
};

