import React from 'react';

import { faFile, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MessageTextboxAttachment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className="message-textbox-attachment">
        {this.props.file.name}
        <span className="message-textbox-attachment-remove" onClick={() => this.props.removeItem(parseInt(this.props.index))}>
          <FontAwesomeIcon icon={faTimes}/>
        </span>
      </span>
    )
  }
}

export default MessageTextboxAttachment