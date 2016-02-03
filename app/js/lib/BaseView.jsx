"use strict"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"

export default class BaseView extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    var gridStyle = {
      backgroundColor: "red"
    };
    
    var rowStyle = {
      backgroundColor: "yellow"
    };
    
    var colStyle = {
      backgroundColor: "green"
    };
    
    return (
      <Grid style={gridStyle} fluid>
        <Row style={rowStyle}>
          <Col style={colStyle} xs={12} md={12}>
            Col1
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col style={colStyle} xs={6} md={4}>Col2</Col>
          <Col style={colStyle} xs={6} md={4}>Col3</Col>
          <Col style={colStyle} xs={6} md={4}>Col4</Col>
        </Row>
      </Grid>
    );
  }
}