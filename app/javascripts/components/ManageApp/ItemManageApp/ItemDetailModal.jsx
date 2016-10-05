import React from "react";
import _ from "lodash";
import { Form, Modal } from "react-bootstrap";

import Input from "lib/Input";
import SubmitButton from "lib/SubmitButton";

import ItemManageAction from "actions/item/ItemManageAction";

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemDetailModal extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      isApplying: false,
      isDeleting: false
    };
  }
  
  /**
   * @private
   * Handler for when applying changes is clicked.
   */
  _onItemUpdate = () => {
    
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
      this._onModalClose();
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isApplying: false
      });
    });
  };
  
  /**
   * @private
   * Handler for deleting the item.
   */
  _onItemDelete = () => {
    this.setState({
      isDeleting: true
    });
    
    ItemManageAction.removeItem(
      this.props.item._id
    ).then(() => {
      this._onModalClose();
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isDeleting: false
      });
    });
  };
  
  /**
   * @private
   * Handler for closing the modal.
   */
  _onModalClose = () => {
    this.setState({
      showModal: false
    });
  };
  
  /**
   * Shows the modal.
   */
  showModal() {
    this.setState({
      showModal: true
    });
  }
  
  /**
   * @private
   * Creates the modal body.
   *
   * @return {JSX}
   */
  _createModalBody() {
    let item = this.props.item;
    
    if (_.isEmpty(item)) {
      return;
    }

    return (
      <Form>
        <Input 
          label="_id"
          disabled={true}
          defaultValue={item._id}
        />
        <Input 
          label="Name"
          ref="name"
          defaultValue={item.name}
        />
      </Form>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let buttonDisabled = this.state.isApplying || this.state.isDeleting;

    return (
      <Modal show={this.state.showModal} onHide={this._onModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Item info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this._createModalBody()}
        </Modal.Body>
        <Modal.Footer>
          <SubmitButton 
            theme="danger" 
            disabled={buttonDisabled}
            isSubmitting={this.state.isDeleting}
            handleSubmit={this._onItemDelete}
          >Delete</SubmitButton>
          <SubmitButton 
            theme="black"
            disabled={buttonDisabled}
            isSubmitting={this.state.isApplying}
            handleSubmit={this._onItemUpdate}
          >Apply</SubmitButton>  
        </Modal.Footer>
      </Modal>
    );
    
  }
}

ItemDetailModal.propTypes = { 
  item: React.PropTypes.object.isRequired
};
