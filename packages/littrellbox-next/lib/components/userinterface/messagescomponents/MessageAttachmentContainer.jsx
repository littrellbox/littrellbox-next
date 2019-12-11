import React from 'react'
import { Components, registerComponent, withMulti, withCurrentUser } from 'meteor/vulcan:core'

class MessageAttachmentContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(newProps, newState) {
    return this.props.results !== newProps.results;
  }

  componentDidUpdate() {
    this.props.scrollToBottom()
  }

  componentDidMount() {
    this.props.scrollToBottom()
  }

  render() {
    let fileAttachments = [];
    if(!this.props.loading) {
      this.props.results.forEach(element => {
        if(element.type === "file") {
          fileAttachments.push(element.attachmentId)
        }
      });
    }

    return(
      <div className="message-attachment-container">
        <span className="message-attachment-files">
          {fileAttachments.map(attachment => <Components.MessageFileAttachment key={attachment} documentId={attachment} forcePositionUpdate={() => this.props.forcePositionUpdate()} scrollToBottom={() => this.props.scrollToBottom()}/>)}
        </span>
      </div>
    )
  }
}

const options = {
  collectionName: "Attachments"
};

registerComponent({ name: 'MessageAttachmentContainer', component: MessageAttachmentContainer, hocs: [withCurrentUser, [withMulti, options]]});