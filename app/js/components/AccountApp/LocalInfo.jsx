"use strict";

import React from "react"
import _ from "underscore"

import { FormControls } from "react-bootstrap"

export default class LocalInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let info = this.props.info
    ,   infoArea;
    
    if (_.isEmpty(info)) {
      infoArea = (
        <div>sign up</div>
      );
    } else {
      infoArea = (
        <form className="form-horizontal">
          <FormControls.Static 
            label="Email"
            labelClassName="col-xs-6" 
            wrapperClassName="col-xs-6">
            {info.email}
          </FormControls.Static>
          <FormControls.Static 
            label="Username"
            labelClassName="col-xs-6" 
            wrapperClassName="col-xs-6">
            {info.username}
          </FormControls.Static>
        </form>
      );
    }
    
    return (
      <div>
        {infoArea}
      </div>
    );
  }
};

LocalInfo.propTypes = {
  info: React.PropTypes.any
};

LocalInfo.defaultProps = {
  info: null
};