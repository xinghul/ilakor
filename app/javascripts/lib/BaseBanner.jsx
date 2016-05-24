"use strict"

import React from "react"

export default class BaseBanner extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  createBannerJsx() {
    let style = {
      
    };
    
    return (
      <div style={style} />
    );
  }
  
  render() {
    let bannerJsx = this.createBannerJsx();
    
    return (
      <div>
        {bannerJsx}        
      </div>
    );
    
  }
}

BaseBanner.propTypes = {
};

BaseBanner.defaultProps = {
};