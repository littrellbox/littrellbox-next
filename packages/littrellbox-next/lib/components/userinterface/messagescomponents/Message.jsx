import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

//formatting
const ReactMarkdown = require('react-markdown')
const emoji = require('remark-emoji');

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import Twemoji from 'react-twemoji'


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
          <div className="message-username">
            <div className="message-userdate">
              {document.username} 
              <span className="message-date">
                - {date.toLocaleDateString(navigator.language, timeOptions)}
              </span> 
            </div>
          </div>
          <div className="message-content">
            <Twemoji options={{ className: 'twemoji' }}>
              <ReactMarkdown
                escapeHtml={true}
                source={this.props.message.text.replaceAll("\\n", "  \n").replaceAll("---", "***")}
                unwrapDisallowed={true}
                plugins={[ emoji ]}
              />
            </Twemoji>
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

//            <div className="message-dropdown">
//<FontAwesomeIcon icon={faEllipsisH}/>
//</div>