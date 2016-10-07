import React from "react";
import { ButtonGroup } from "react-bootstrap";

import BlockTypeButton from "./BlockTypeButton";

import styles from "lib/DraftEditor/BlockTypeControl.scss";

// supported block types
const BLOCK_TYPES = [
  {label: "H1", style: "header-one"},
  {label: "H2", style: "header-two"},
  {label: "H3", style: "header-three"},
  {label: "H4", style: "header-four"},
  {label: "H5", style: "header-five"},
  {label: "H6", style: "header-six"},
  {icon: "quote-left", style: "blockquote"},
  {icon: "list-ul", style: "unordered-list-item"},
  {icon: "list-ol", style: "ordered-list-item"},
  {icon: "code", style: "code-block"},
];

/**
 * @class
 * @extends {React.Component}
 */
export default class BlockTypeControl extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * Handler for when BlockTypeButton's onToggle is called.
   * @param  {String} style the toggled style name.
   */
  onToggle = (style) => {
    this.props.onToggle(style);
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { editorState } = this.props;
    
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className={styles.blockTypeControl}>
        <ButtonGroup>
          {BLOCK_TYPES.map((type) => {
            return (
              <BlockTypeButton 
                type={type}
                key={type.style}
                active={type.style === blockType}
                onToggle={this.onToggle.bind(this, type.style)} 
              />
            );
          })}
        </ButtonGroup>
      </div>
    );
  }
}

BlockTypeControl.propTypes = {
  editorState: React.PropTypes.object.isRequired,
  onToggle: React.PropTypes.func.isRequired
};

