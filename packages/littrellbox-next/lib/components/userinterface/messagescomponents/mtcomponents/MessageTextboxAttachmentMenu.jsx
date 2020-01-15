import React from 'react';

import {Components} from 'meteor/vulcan:core'

import { faFile, faPoll } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Hidden, HiddenWithMoveUp, Visible} from "../../../lib/AnimationStyles";
import {VisitSchemaKind} from "graphql-tools/dist/transforms/visitSchema";

class MessageTextboxAttachmentMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPollMenu: false
    }
  }

  onAttachmentButtonClick() {
    this.fileDialog.click();
    this.props.toggleAttachments();
  }

  togglePollMenu() {
    this.setState({
      showPollMenu: !this.state.showPollMenu
    })
  }

  render() {
    return (
      <div className="message-textbox-attachment-menu" style={this.props.style}>
        <div className="mta-menu-header">
          Attachments
        </div>
        <div className="mta-menu-item" onClick={() => this.togglePollMenu()}>
          <span><FontAwesomeIcon icon={faPoll} className="icon-workaround"/> Poll</span>
        </div>
        <div className="mta-menu-item" onClick={() => this.onAttachmentButtonClick()}>
          <span><FontAwesomeIcon icon={faFile} className="icon-workaround"/> File</span>
          <input type="file" id="file-dialog" multiple ref={(el) => { this.fileDialog = el; }} style={{display: 'none'}} onChange={(e) => this.props.addFile(e.target.files)}/>
        </div>
        <Components.PollModal style={this.state.showPollMenu ? Visible : HiddenWithMoveUp}/>
        <div className="dialog-semi-transparent-background" onClick={() => {this.togglePollMenu(); this.props.toggleAttachments()}} style={this.state.showPollMenu ? Visible : Hidden}/>
      </div>
    )
  }
}

export default MessageTextboxAttachmentMenu