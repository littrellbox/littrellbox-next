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

    console.log(this.props.message)

    return(
      <div className="message">
        <div className="message-username">{document.username}</div>
        <div className="message-content">
          <ReactMarkdown
            escapeHtml={true}
            source={this.props.message.text.replaceAll("\\n", "  \n").replaceAll("---", "***")}
            unwrapDisallowed={true}
            plugins={[ gemojiToEmoji ]}
          />
        </div>
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'Message', component: Message, hocs: [withCurrentUser, [withSingle, options]] });