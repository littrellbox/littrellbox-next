import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

const ReactMarkdown = require('react-markdown')
const gemojiToEmoji = require('remark-gemoji-to-emoji');

import { formatText } from '../../lib/FormatText'

class Message extends React.Component {
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

    var date = new Date(this.props.message.createdAt)

    var timeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric'}

    return(
      <div className="message">
        <div className="message-profile-picture"></div>
        <div>
          <div className="message-username">{document.username} <span className="message-date">- {date.toLocaleDateString(navigator.language, timeOptions)}</span></div>
          <div className="message-content">
            <ReactMarkdown
              escapeHtml={true}
              source={this.props.message.text.replaceAll("\\n", "  \n").replaceAll("---", "***")}
              unwrapDisallowed={true}
              plugins={[ gemojiToEmoji ]}
            />
          </div>
        </div>
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'Message', component: Message, hocs: [withCurrentUser, [withSingle, options]] });