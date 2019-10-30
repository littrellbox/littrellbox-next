import React from 'react'
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

class MessageContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    document = this.props.document
    if(!this.props.document) {
      document = {
        username: "Unknown User"
      }
    }
    if(this.props.document && (!this.props.document.username || this.props.document.username == "")) {
      document = {
        username: "Deleted User"
      }
    }

    var date = new Date(this.props.messages[0].createdAt)

    var timeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric'}
     return (
      <div className="message">
        <div className="message-profile-picture"/>
        <div style={{width: "100%"}}>
          <div className="message-header">
            <div className="message-userdate">
              {document.username}
              <span className="message-date">
                 - {date.toLocaleDateString(navigator.language, timeOptions)}
              </span> 
            </div>
          </div>
          <div className="message-content">
            {this.props.messages.map((message) => <Components.Message 
              key={message._id} 
              message={message} 
              documentId={message.userId}
              scrollToBottom={() => this.props.scrollToBottom()}
              scrollToBottomMessageMount={() => this.props.scrollToBottomMessageMount()}
              forcePositionUpdate={() => this.props.forcePositionUpdate()}
              isScrolled={this.props.isScrolled}
            />)}
          </div>
        </div>
        
      </div>
     )
  }
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'MessageContainer', component: MessageContainer, hocs: [withCurrentUser, [withSingle, options]] });