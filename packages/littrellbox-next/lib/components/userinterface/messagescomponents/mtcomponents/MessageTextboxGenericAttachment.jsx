import React from 'react';

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MessageTextboxGenericAttachment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span className="message-textbox-attachment">
        {this.props.attachment.name}
        <span className="message-textbox-attachment-remove" onClick={() => this.props.removeItem(parseInt(this.props.index))}>
          <FontAwesomeIcon icon={faTimes}/>
        </span>
      </span>
    )
  }
}

export default MessageTextboxGenericAttachment