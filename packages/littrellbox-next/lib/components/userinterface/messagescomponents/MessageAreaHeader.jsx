import React from 'react'
import { Components, withCurrentUser, registerComponent, withSingle, withUpdate } from 'meteor/vulcan:core';

import { ChatContext } from '../../../contexts/ChatContext'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHashtag, faUsers, faUserPlus} from '@fortawesome/free-solid-svg-icons'

class MessageAreaHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddUser: false,
      textboxText: "",
      textboxHasBeenModified: false
    }
  }

  _timeoutId;

  toggleAddUser() {
    this.setState({
      showAddUser: !this.state.showAddUser
    })
  }

  handleChange(e) {
    this.setState({
      textboxText: e.target.value,
      textboxHasBeenModified: true
    })
  }

  handleKeyPress(e, id) {
    documentId = id
    if(e.key === 'Enter') {
      this.props.updateChannel({
        selector: {documentId},
        data: {
          name: this.state.textboxText
        }
      })
    }
  }

  handleBlur(name) {
    this.setState({
      textboxText: name
    })
  }

  render() {
    return(
      <ChatContext.Consumer>
        {({channel}) => {
          channelNameText = channel.name
          icon = faHashtag
          if(this.props.document && channel.isDm && channel.dmUserIds.length == 2)
            channelNameText = this.props.document.username
          if(channel.isDm)
            icon = faUsers
          if(this.state.textboxHasBeenModified)
            channelNameText = this.state.textboxText
          return (<div className="message-area-header">
            <div className="message-area-header-text">
              <FontAwesomeIcon icon={icon} className="message-area-header-icon"/> 
              {channel.isDm && channel.dmUserIds.length > 2 && channel.userId == this.props.currentUser._id && <input 
                type="text" 
                value={channelNameText}
                onBlur={() => this.handleBlur(channel.name)}
                onKeyPress={(e) => this.handleKeyPress(e, channel._id)}
                onChange={(e) => this.handleChange(e)}
                className="message-area-header-textbox"
              />}
              {(!channel.isDm || channel.dmUserIds.length == 2 || channel.userId != this.props.currentUser._id) && <span> {channelNameText}</span>}
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

const channelOptions = {
  collectionName: "Channels"
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'MessageAreaHeader', component: MessageAreaHeader, hocs: [withCurrentUser, [withSingle, options], [withUpdate, channelOptions]]});