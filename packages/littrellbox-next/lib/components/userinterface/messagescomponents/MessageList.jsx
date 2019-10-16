import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './Message'

class MessageList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "auto" });
  }

  reverseWorkaround() {
    return [...this.props.items].reverse()
  }

  render() {
    return (
      <div className="message-list">
        <div>
          {this.reverseWorkaround().map(message => <Components.Message key={message._id} message={message} documentId={message.userId}/>)}
        </div>
        <div ref={(el) => { this.messagesEnd = el; }}/>
      </div>
    )
  }
}

registerComponent({ name: 'MessageList', component: MessageList, hocs: [withCurrentUser] });