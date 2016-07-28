"use strict";

import React from "react"
import FontAwesome from "react-fontawesome"
import { shallow } from "enzyme"
import { expect } from "chai"

import Icon from "./Icon.jsx"

describe("Common #Icon", () => {
  
  let iconInstance;
  
  before(() => {
    
    const props = {
      className: "test-class-name",
      name: "icon"
    };
    
    iconInstance = shallow(<Icon {...props} />);
    
  });
  
  it("Should be present", (done) => {
    
    expect(iconInstance).to.be.present();
    
    done();
    
  });
  
  it("Should have props set correctly", (done) => {
    
    expect(iconInstance.prop("name")).to.equal("icon");
    expect(iconInstance.prop("className").trim()).to.equal("test-class-name");
    
    done();
    
  });
  
  it("Should have a child 'FontAwesome' with props set correctly", (done) => {
    
    expect(iconInstance.find(FontAwesome)).to.have.length(1);
    expect(iconInstance.find(FontAwesome).prop("className").trim()).to.equal("test-class-name");
    
    done();
    
  });
  
});