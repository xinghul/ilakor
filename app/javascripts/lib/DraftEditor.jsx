"use strict"

import React from "react"
import _ from "lodash"
import { Editor, EditorState, RichUtils } from "draft-js"
import { stateToHTML } from "draft-js-export-html"

import InlineStyleControl from "./DraftEditor/InlineStyleControl"
import BlockTypeControl from "./DraftEditor/BlockTypeControl"

import styles from "lib/DraftEditor.scss"

export default class DraftEditor extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }
  
  _onChange = (editorState) => {
    this.setState({
      editorState: editorState
    });
  };
  
  _focusEditor = () => {
    this.refs.editor.focus()
  };
  
  _toggleBlockType = (blockType) => {
    this._onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  };
  
  _toggleInlineStyle = (inlineStyle) => {
    this._onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  };
  
  getHtml() {
    return stateToHTML(this.state.editorState.getCurrentContent());
  };
  
  clear() {
    this.setState({
      editorState: EditorState.createEmpty()
    });
  }
  
  render() {
    
    const { editorState } = this.state;
    
    return (
      <div className={styles.draftEditor}>
        <div hidden={_.isEmpty(this.props.label)} className={styles.label}>{this.props.label}</div>
        <BlockTypeControl onToggle={this._toggleBlockType} editorState={editorState} />
        <InlineStyleControl onToggle={this._toggleInlineStyle} editorState={editorState} />
        <div className={styles.editorArea} onClick={this._focusEditor}>
          <Editor
            ref="editor"
            editorState={editorState} 
            onChange={this._onChange}
            handleKeyCommand={this.handleKeyCommand}
          />
        </div>
      </div>
    );
  }
}

DraftEditor.propTypes = {
  label: React.PropTypes.string
};

DraftEditor.defaultProps = {
  label: ""
};
