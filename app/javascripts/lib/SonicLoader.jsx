import React from "react";
import _ from "lodash";
import Sonic from "sonic.js";

import styles from "lib/SonicLoader.scss";

const SONIC_LOADER_ID = "sonicLoader";

/**
* @class
* @extends {React.Component}
*/
export default class SonicLoader extends React.Component {
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
    		["arc", 50, 50, 30, 0, 360]
    	],

    	step: function(point, index, frame) {

    		let sizeMultiplier = 5;
    		
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
    
    const { hidden } = this.props;
    
    let classNames = [ styles.sonicLoader ];
    
    // push in additional className 
    classNames.push(this.props.className);
    
    let style = {
      display: hidden ? "none" : "block"
    };
    
    return (
      <div className={classNames.join(' ')} style={style}>
        <div id={this._loaderId} />
      </div>
      
    );
  }
}

SonicLoader.propTypes = {
  size: React.PropTypes.number,
  fill: React.PropTypes.string,
  hidden: React.PropTypes.bool
};

SonicLoader.defaultProps = {
  size: 100,
  fill: "gray",
  hidden: false
};

