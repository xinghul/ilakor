import React from "react";
import _ from "lodash";
import invariant from "invariant";

import Input from "lib/Input";
import GridSection from "lib/GridSection";
import GhostButton from "lib/GhostButton";

import styles from "components/CheckoutApp/AddressSection.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class AddressSection extends React.Component {

  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }

  /**
   * @private
   * Handler for when the "Next" button is clicked.
   * Checks if all the necessary fields have been filled,
   * if not, call the onError handler with the error message.
   */
  _onNextButtonClicked = () => {

    const { onSubmit, onError } = this.props;
    let emptyFields = [];

    let name = this.refs["name"].getValue()
    ,   address1 = this.refs["address1"].getValue()
    ,   address2 = this.refs["address2"].getValue()
    ,   city = this.refs["city"].getValue()
    ,   province = this.refs["province"].getValue()
    ,   pcode = this.refs["pcode"].getValue()
    ,   phone = this.refs["phone"].getValue();

    if (_.isEmpty(name)) {
      emptyFields.push("Name");
    }
    if (_.isEmpty(address1)) {
      emptyFields.push("Address 1");
    }
    if (_.isEmpty(city)) {
      emptyFields.push("City");
    }
    if (_.isEmpty(province)) {
      emptyFields.push("Province");
    }
    if (_.isEmpty(pcode)) {
      emptyFields.push("Postal code");
    }
    if (_.isEmpty(phone)) {
      emptyFields.push("Phone");
    }

    if (!_.isEmpty(emptyFields)) {
      let errorMessage = constructErrorMessage(emptyFields);

      onError(errorMessage);
    } else {
      let addressInfo = {
        name,
        address1,
        address2,
        city,
        province,
        pcode,
        phone
      };

      onSubmit(addressInfo);
    }

  };

  /**
   * @inheritdoc
   */
  render() {
    return (
      <GridSection>
        <Input ref="name" label="Name" placeholder="Enter name" />
        <Input ref="address1" label="Address 1" placeholder="Enter address line 1" />
        <Input ref="address2" label="Address 2" placeholder="Enter address line 2 (optional)" />
        <Input ref="city" label="City" placeholder="Enter city" />
        <Input ref="province" label="Province" placeholder="Enter province" />
        <Input ref="pcode" label="Postal code" placeholder="Enter postal code" />
        <Input ref="phone" label="Phone" placeholder="Enter phone number" />
        <GhostButton
          onClick={this._onNextButtonClicked}
          block
          theme="success"
        >Next</GhostButton>
      </GridSection>
    );
  }
}

AddressSection.propTypes = {
  onSubmit: React.PropTypes.func,
  onError: React.PropTypes.func
};

AddressSection.defaultProps = {
  onSubmit: () => {},
  onError: () => {}
};

/**
 * Constructs the error message based on given empty fields.
 *
 * @param  {Array<String>} emptyFields the empty fields.
 *
 * @return {String}
 */
function constructErrorMessage(emptyFields) {

  let message = "Please enter ";

  _.forEach(emptyFields, (field, index) => {

    if (index > 0) {
      message += " and ";
    }

    message += field;

    if (index === emptyFields.length - 1) {
      message += ".";
    }

  });

  return message;
}
