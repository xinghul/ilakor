import React from "react";
import { ButtonGroup } from "react-bootstrap";

import InlineStyleButton from "./InlineStyleButton";

import styles from "lib/DraftEditor/InlineStyleControl.scss";

// supported inline styles
const INLINE_STYLES = [
  "BOLD",
  "ITALIC",
  "UNDERLINE"
];

/**
 * @class
 * @extends {React.Component}
 */
export default class InlineStyleControl extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * Handler for when InlineStyleButton's onToggle is called.
   * @param  {String} style the toggled style name.
   */
  onToggle = (style) => {
    this.props.onToggle(style);
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    let currentInlineStyle = this.props.editorState.getCurrentInlineStyle();

    return (
      <div className={styles.inlineStyleControl}>
        <ButtonGroup>
          {INLINE_STYLES.map((style) => {
            return (
              <InlineStyleButton 
                icon={_.toLower(style)} 
                key={style}
                active={currentInlineStyle.has(style)}
                onToggle={this.onToggle.bind(this, style)} 
              />
            );
          })}
        </ButtonGroup>
      </div>
    );
  }
}

InlineStyleControl.propTypes = {
  editorState: React.PropTypes.object.isRequired,
  onToggle: React.PropTypes.func.isRequired
};

