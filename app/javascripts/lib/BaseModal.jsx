"use strict"

import React from "react"
import { Modal, Button, Tooltip } from "react-bootstrap"

import BaseInput from "lib/BaseInput.jsx"

export default class BaseModal extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  onApply = () => {
    let itemInfo = this.props.item
    ,   newValue = {};
    
    for (let key in itemInfo)
    {
      newValue[key] = this.refs[key].getValue();
    }
    
    this.props.onApply(newValue);
  };
  
  onDelete = () => {
    this.props.onDelete();
  };
  
  onClose = () => {
    this.props.onClose();
  };
  
  createKeyValueForm(itemInfo) {
    let formItems = [];
    
    for (let key in itemInfo)
    {
      let isDisabled = false;
      // mark is as disabled 
      if (key === "_id" || key === "__v") {
        isDisabled = true;
      }
      
      formItems.push(
        <BaseInput 
          key={key}
          type="text"
          label={key}
          ref={key}
          disabled={isDisabled}
          defaultValue={itemInfo[key]}
        />        
      );
    }

    return formItems;
  }

  render() {
    
    let itemInfo = this.props.item;
    
    let keyValueForm = this.createKeyValueForm(itemInfo);

    return (
      <Modal show={this.props.showModal} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Item info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {keyValueForm}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.onDelete}>Delete</Button>
          <Button bsStyle="success" onClick={this.onApply}>Apply</Button>  
        </Modal.Footer>
      </Modal>
    );
    
  }
}

BaseModal.propTypes = { 
  // required props
  showModal: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onApply: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  
  item: React.PropTypes.object
};

BaseModal.defaultProps = {
  onApply: function() {},
  onDelete: function() {},
  
  item: []
};