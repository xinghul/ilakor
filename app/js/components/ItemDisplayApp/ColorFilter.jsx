"use strict"

import React from "react"
import { Button, Glyphicon, Panel } from "react-bootstrap"
import CSSModules from "react-css-modules"

import styles from "./ColorFilter.css"

class ColorFilter extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      expanded: false,
      colors: {}
    };   
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  onColorSelect = (color) => {
    let colors = this.state.colors;
    
    if (colors.hasOwnProperty(color)) {
      delete colors[color];
    } else {
      colors[color] = true;
    }
    
    console.log("colors", colors);
    this.setState({
      colors: colors
    });
  };
  
  createColorItems() {
    let colorItemsJsx = []
    ,   colors = [
      "white", "grey", "darkgrey", "brown", "darkred", "goldenrod", "purple", "black"
    ];
    
    for (let color of colors)
    {
      let style = {
        backgroundColor: color
      };
      
      colorItemsJsx.push(
        <li key={color} styleName="color-item">
          <Button 
            style={style} 
            styleName="color-circle"
            onClick={this.onColorSelect.bind(this, color)}
          />
        </li>
      );
    }
    
    return (
      <ul styleName="color-container">
        {colorItemsJsx}
      </ul>
    )
  }
    
  handleCollapseButtonClick = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };
  
  render() {
    
    let glyph = do {
      if (this.state.expanded) {
        "minus"
      } else {
        "plus"
      }
    }
    
    return (
      <div>
        <Button styleName="expand-button" bsSize="xsmall" onClick={this.handleCollapseButtonClick}>
          COLORS
          <Glyphicon glyph={glyph} />
        </Button>
        <Panel styleName="color-panel" collapsible expanded={this.state.expanded}>
          {this.createColorItems()}
        </Panel>
      </div>
    );
    
  }
}

export default CSSModules(ColorFilter, styles)