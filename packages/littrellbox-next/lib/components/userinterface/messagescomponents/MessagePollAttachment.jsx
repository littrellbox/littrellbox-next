import React from 'react'
import { registerComponent, withSingle, withCurrentUser } from 'meteor/vulcan:core'

import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { HiddenWithMoveUp, Visible, Hidden, PointerEventsWorkaround } from '../../lib/AnimationStyles'

class MessagePollAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullView: false
    }
  }

  componentDidUpdate() {
    this.props.scrollToBottom()
  }

  componentDidMount() {
    this.props.scrollToBottom()
  }

  getPollQuestions() {
    console.log(this.props.document.pollObject)
    return Object.entries(JSON.parse(this.props.document.pollObject))
  }

  render() {
    if(!this.props.loading) {
      return (
        <div className="message-attachment-file">
          <span className="message-attachment-poll-name">{this.props.document.pollText}</span>
          <div className="message-attachment-poll-container">
            {this.getPollQuestions().map((currentValue, index) => (<div key={index} className="message-attachment-poll-answer">{currentValue[0]}</div>))}
          </div>
        </div>
      )
    }
    return null
  }
}

const options = {
  collectionName: "Polls"
};

registerComponent({ name: 'MessagePollAttachment', component: MessagePollAttachment, hocs: [withCurrentUser, [withSingle, options]]});