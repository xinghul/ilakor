"use strict"

import React from "react"
import _ from "lodash"
import { Form, Modal, Button, Tooltip } from "react-bootstrap"

import BaseInput from "lib/BaseInput"

export default class ItemDetailModal extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  onApply = () => {
    let item = this.props.item
    ,   newValue = {};
    
    for (let key in item)
    {
      if (!_.isEmpty(this.refs[key]))
      {
        newValue[key] = this.refs[key].getValue();        
      }
    }

    this.props.onApply(newValue);
  };
  
  onDelete = () => {
    this.props.onDelete();
  };
  
  onClose = () => {
    this.props.onClose();
  };
  
  createKeyValueForm() {
    let item = this.props.item;
    
    if (_.isEmpty(item)) {
      return;
    }

    return (
      <Form>
        <BaseInput 
          type="text"
          label="_id"
          disabled={true}
          initialValue={item._id}
        />
        <BaseInput 
          type="text"
          label="Name"
          ref="name"
          initialValue={item.name}
        />
      </Form>
    );
  }

  render() {
    
    let keyValueForm = this.createKeyValueForm();

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

ItemDetailModal.propTypes = { 
  // required props
  showModal: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onApply: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  
  item: React.PropTypes.object
};

ItemDetailModal.defaultProps = {
  onApply: function() {},
  onDelete: function() {},
  
  item: {}
};