"use strict"

import React from "react"
import { Button, Glyphicon, Panel } from "react-bootstrap"
import styles from "components/ItemDisplayApp/ColorFilter.scss"

export default class ColorFilter extends React.Component {
  
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
        <li key={color} className={styles.colorItem}>
          <Button 
            style={style} 
            className={styles.colorCircle}
            onClick={this.onColorSelect.bind(this, color)}
          />
        </li>
      );
    }
    
    return (
      <ul className={styles.colorContainer}>
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
        <Button className={styles.expandButton} bsSize="xsmall" onClick={this.handleCollapseButtonClick}>
          COLORS
          <Glyphicon glyph={glyph} />
        </Button>
        <Panel className={styles.colorPanel} collapsible expanded={this.state.expanded}>
          {this.createColorItems()}
        </Panel>
      </div>
    );
    
  }
}
