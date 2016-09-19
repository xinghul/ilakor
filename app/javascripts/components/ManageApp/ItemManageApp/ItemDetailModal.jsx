import React from "react";
import _ from "lodash";
import { Form, Modal } from "react-bootstrap";

import Input from "lib/Input";
import SubmitButton from "lib/SubmitButton";

import ItemManageAction from "actions/item/ItemManageAction";

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
        <Input 
          label="_id"
          disabled={true}
          initialValue={item._id}
        />
        <Input 
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
            theme="danger" 
            disabled={buttonDisabled}
            isSubmitting={this.state.isDeleting}
            handleSubmit={this.handleDelete}
          >Delete</SubmitButton>
          <SubmitButton 
            theme="black"
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
