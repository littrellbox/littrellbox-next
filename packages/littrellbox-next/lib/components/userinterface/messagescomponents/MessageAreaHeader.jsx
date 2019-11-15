import React from 'react'
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

import { ChatContext } from '../../../contexts/ChatContext'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHashtag, faUsers} from '@fortawesome/free-solid-svg-icons'

class MessageAreaHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ChatContext.Consumer>
        {({channel}) => {
          channelNameText = channel.name
          icon = faHashtag
          if(this.props.document && channel.isDm && channel.dmUserIds.length == 2) {
            channelNameText = this.props.document.username
            icon = faUsers
          }
          if(channel.isGm) {
            icon = faUsers
          }
          return (<div className="message-area-header">
            <span className="message-area-header-text">
              <FontAwesomeIcon icon={icon} className="message-area-header-icon"/> {channelNameText}
            </span>
          </div>)
        }}
      </ChatContext.Consumer>
    )
  }
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'MessageAreaHeader', component: MessageAreaHeader, hocs: [withCurrentUser, [withSingle, options]]});