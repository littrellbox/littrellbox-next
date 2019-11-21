import React from 'react'
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

import { ChatContext } from '../../../contexts/ChatContext'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHashtag, faUsers, faUserPlus} from '@fortawesome/free-solid-svg-icons'

class MessageAreaHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddUser: false
    }
  }

  toggleAddUser() {
    this.setState({
      showAddUser: !this.state.showAddUser
    })
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
            <div className="message-area-header-text">
              <FontAwesomeIcon icon={icon} className="message-area-header-icon"/> {channelNameText}
            </div>
            <div className="message-area-header-buttons">
              {channel.isDm && <div className="message-area-header-add-user-button">
                <FontAwesomeIcon icon={faUserPlus} onClick={() => this.toggleAddUser()}/>
                {this.state.showAddUser && <Components.MessageAreaHeaderAddUser channel={channel}/>}
              </div>}
            </div>
            {this.state.showAddUser && <div className="dialog-transparent-background" onClick={() => this.toggleAddUser()}/>}
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