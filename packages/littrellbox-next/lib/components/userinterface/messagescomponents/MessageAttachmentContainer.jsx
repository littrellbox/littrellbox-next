import React from 'react'
import { Components, registerComponent, withMulti } from 'meteor/vulcan:core'

class MessageAttachmentContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    fileAttachments = []
    this.props.results.forEach(element => {
      
    });

    return(
      <div className="message-attachment-container">
        
      </div>
    )
  }
}

const options = {
  collectionName: "Attachments"
}

registerComponent({ name: 'MessageAttachmentContainer', component: MessageAttachmentContainer, hocs: [[withMulti, options]]})