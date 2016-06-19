"use strict"

import React from "react"
import _ from "lodash"
import { Form, Modal, Row, Col } from "react-bootstrap"

import BaseInput from "lib/BaseInput"
import SubmitButton from "lib/SubmitButton"

import ItemManageAction from "actions/ItemManageAction"

export default class ItemDetailModal extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      isApplying: false,
      isDeleting: false
    };
  }
  
  handleApply = () => {
    
    let item = this.props.item
    ,   newValue = {};
    
    for (let key in item)
    {
      if (!_.isEmpty(this.refs[key]))
      {
        newValue[key] = this.refs[key].getValue();        
      }
    }
    
    this.setState({
      isApplying: true
    });
    
    ItemManageAction.updateItem(
      item._id,
      newValue
    ).then(() => {
      this.onClose();
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isApplying: false
      });
    });
  };
  
  handleDelete = () => {
    this.setState({
      isDeleting: true
    });
    
    ItemManageAction.removeItem(
      this.props.item._id
    ).then(() => {
      this.onClose();
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isDeleting: false
      });
    });
  };
  
  onClose = () => {
    this.setState({
      showModal: false
    });
  };
  
  showModal() {
    this.setState({
      showModal: true
    });
  }
  
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
    
    let keyValueForm = this.createKeyValueForm()
    ,   buttonDisabled = this.state.isApplying || this.state.isDeleting;

    return (
      <Modal show={this.state.showModal} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Item info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {keyValueForm}
        </Modal.Body>
        <Modal.Footer>
          <SubmitButton 
            bsStyle="danger" 
            disabled={buttonDisabled}
            isSubmitting={this.state.isDeleting}
            handleSubmit={this.handleDelete}
          >Delete</SubmitButton>
          <SubmitButton 
            bsStyle="success"
            disabled={buttonDisabled}
            isSubmitting={this.state.isApplying}
            handleSubmit={this.handleApply}
          >Apply</SubmitButton>  
        </Modal.Footer>
      </Modal>
    );
    
  }
}

ItemDetailModal.propTypes = { 
  item: React.PropTypes.object.isRequired
};

ItemDetailModal.defaultProps = {
};