import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

const Message = ({message, currentUser, document}) => {
  if(!document) {
    document = {
      username: "Unknown User"
    }
  }
  return (
    <div className="message">
      <div className="message-username">{document.username}</div>
      <div className="message-content">{message.text}</div>
    </div>
  )
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'Message', component: Message, hocs: [withCurrentUser, [withSingle, options]] });