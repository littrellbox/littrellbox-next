import React from 'react'
import { Components, registerComponent, withMulti, withCurrentUser } from 'meteor/vulcan:core'

class MessageAttachmentContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    this.props.scrollToBottom()
  }

  render() {
    fileAttachments = []
    if(!this.props.loading) {
      this.props.results.forEach(element => {
        if(element.type == "file") {
          fileAttachments.push(element.attachmentId)
        }
      });
    }

    return(
      <div className="message-attachment-container">
        <span className="message-attachment-files">
          {fileAttachments.map(attachment => <Components.MessageFileAttachment key={attachment} documentId={attachment} scrollToBottom={() => this.props.scrollToBottom()}/>)}
        </span>
      </div>
    )
  }
}

const options = {
  collectionName: "Attachments"
}

registerComponent({ name: 'MessageAttachmentContainer', component: MessageAttachmentContainer, hocs: [withCurrentUser, [withMulti, options]]})