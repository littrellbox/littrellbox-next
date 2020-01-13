import React from 'react';

import { faFile, faPoll } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MessageTextboxAttachmentMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  onAttachmentButtonClick() {
    this.fileDialog.click();
  }

  render() {
    return (
      <div className="message-textbox-attachment-menu">
        <div className="mta-menu-header">
          Attachments
        </div>
        <div className="mta-menu-item">
          <span><FontAwesomeIcon icon={faPoll} className="icon-workaround"/> Poll</span>
        </div>
        <div className="mta-menu-item" onClick={() => this.onAttachmentButtonClick()}>
          <span><FontAwesomeIcon icon={faFile} className="icon-workaround"/> File</span>
          <input type="file" id="file-dialog" multiple ref={(el) => { this.fileDialog = el; }} style={{display: 'none'}} onChange={(e) => this.props.addFile(e.target.files)}/>
        </div>
      </div>
    )
  }
}

export default MessageTextboxAttachmentMenu