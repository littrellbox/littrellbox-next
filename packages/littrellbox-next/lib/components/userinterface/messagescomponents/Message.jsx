import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle, withDelete, withUpdate } from 'meteor/vulcan:core';

//formatting
const ReactMarkdown = require('react-markdown/with-html')
const emoji = require('remark-emoji');

import joypixels from 'emoji-toolkit'
import escapeHtml from 'escape-html'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import Twemoji from 'react-twemoji'

import './MessageEditTextbox'
import { formatApolloErrors } from 'apollo-server-core';

class Message extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      showEditDropdown: false,
      isEditing: false
    }

  }

  componentDidUpdate() {
    this.props.scrollToBottom();
  }

  deleteMessage() {
    //this is litterally message suicide
    document = this.props.message
    documentId = document._id
    this.props.updateMessage({
      selector: { documentId },
      data: {
        text: "placeholder workaround"
      }
    })
  }

  toggleMenu() {
    this.setState({
      showEditDropdown: !this.state.showEditDropdown
    })
  }

  toggleEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    })
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
        <div style={{width: "100%"}}>
          <div className="message-header">
            <div className="message-userdate">
              {document.username}
              <span className="message-date">
                 - {date.toLocaleDateString(navigator.language, timeOptions)}
              </span> 
            </div>
            {!this.props.loading && this.props.currentUser._id == this.props.document._id && <div className="message-dropdown" onClick={() => this.toggleMenu()}>
              <FontAwesomeIcon icon={faEllipsisH}/>
            </div>}
            {this.state.showEditDropdown && <div className="message-dropdown-menu">
              <div className="message-dropdown-item" onClick={() => this.toggleEdit()}>
                Edit
              </div>
              <div className="message-dropdown-item" style={{color: "#cc1111"}} onClick={() => this.deleteMessage()}>
                Delete
              </div>
            </div>}
          </div>
          {this.state.showEditDropdown && <div className="dialog-transparent-background" onClick={() => this.toggleMenu()}/>}
          {!this.state.isEditing && !this.props.loading && <div className="message-content">
          <ReactMarkdown
            escapeHtml={false}
            source={joypixels.shortnameToImage(escapeHtml(this.props.message.text.replaceAll("\\n", "  \n").replaceAll("---", "***")))}
            unwrapDisallowed={true}
          />
          </div>}
          {this.state.isEditing && <div className="message-content"> 
            <Components.MessageEditTextbox 
              document={this.props.message} 
              closeEditor={() => this.toggleEdit()}
              scrollToBottom={() => this.props.scrollToBottom()}
            />
          </div>}
        </div>
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
};

const deleteOptions = {
  collectionName: "Messages"
};

registerComponent({ name: 'Message', component: Message, hocs: [withCurrentUser, [withSingle, options], [withDelete, deleteOptions], [withUpdate, deleteOptions]] });

//noWrapper: bool
//tag: string, default: div