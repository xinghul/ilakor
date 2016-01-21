+function(undefined) {
"use strict";

var React = require("react");

var MockGenStore   = require("../stores/MockGenStore")
,   MockGenActions = require("../actions/MockGenActions");

// Method to retrieve state from Stores
function getMockGenState() {
  return {
    data: MockGenStore.getCsvData()
  };
}

function generateCsv() {
  MockGenActions.generateCsv();
}

// Define main Controller View
var MockGenApp = React.createClass({

  // Get initial state from stores
  getInitialState: function() {
    return getMockGenState();
  },

  // Add change listeners to stores
  componentDidMount: function() {
    MockGenStore.addChangeListener(this._onChange);
  },

  // Remove change listers from stores
  componentWillUnmount: function() {
    MockGenStore.removeChangeListener(this._onChange);
  },

  // Render our child components, passing state via props
  render: function() {
    return (
      <div id="mockGenApp">
        <div className="row">
          <div className="col-xs-3" id="testName">{this.state.data.name}</div>
        </div>
        <div className="row">
          <button className="btn btn-default" onClick={generateCsv}>Generate</button>
        </div>
      </div>
    );
  },

  // Method to setState based upon Store changes
  _onChange: function() {
    this.setState(getMockGenState());
  }

});

module.exports = MockGenApp;

}();
