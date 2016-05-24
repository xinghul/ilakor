"use strict"

import React from "react"


function getStateFromStores() {
  return {
  };
}

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  _onChange() {
    this.setState(getStateFromStores());
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  render() {
    return (
      <div className="fb-page" 
        data-href="https://www.facebook.com/facebook" 
        data-tabs="timeline" 
        data-small-header="false" 
        data-adapt-container-width="true" 
        data-hide-cover="false" 
        data-show-facepile="true">
        <div className="fb-xfbml-parse-ignore">
          <blockquote cite="https://www.facebook.com/facebook">
            <a href="https://www.facebook.com/facebook">Facebook</a>
          </blockquote>
        </div>
      </div>
    );
  }
  
}
