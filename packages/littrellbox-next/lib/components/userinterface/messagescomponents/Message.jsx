import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle, withDelete } from 'meteor/vulcan:core';

//formatting
const ReactMarkdown = require('react-markdown/with-html')

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import formatText from '../../lib/FormatText'

import './MessageEditTextbox'

import CircleLoader from '../../lib/Loader'

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

  componentDidMount() {
    this.props.scrollToBottom();
  }

  deleteMessage() {
    //this is litterally message suicide
    document = this.props.message
    documentId = document._id
    this.props.deleteMessage({documentId})
    this.toggleMenu()
  }

  deleteUser() {
    documentId = this.props.document._id
    this.props.deleteUser({documentId})
    this.toggleMenu()
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
    this.toggleMenu()
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

    var date = new Date(this.props.message.createdAt)

    var timeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric'}

    return(
      <div className="message">
        {this.props.loading && <div>
          <CircleLoader/> <span className="loading-text">Loading...</span>
        </div>}
        {!this.props.loading && <div className="message">
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
              {!this.props.loading && this.props.currentUser._id != this.props.document._id && this.props.currentUser.isAdmin && <div className="message-dropdown" onClick={() => this.toggleMenu()}>
                <FontAwesomeIcon icon={faEllipsisH}/>
              </div>}
              {this.state.showEditDropdown && <div className="dropdown-menu message-dropdown-menu">
                <div className="dropdown-item" onClick={() => this.toggleEdit()}>
                  Edit
                </div>
                <div className="dropdown-item" style={{color: "#cc1111"}} onClick={() => this.deleteMessage()}>
                  Delete
                </div>
                {this.props.currentUser.isAdmin && <div>
                  <div className="dropdown-header">
                    Mod Tools
                  </div>
                  <div className="dropdown-item" onClick={() => this.deleteUser()}>
                    Global Ban
                  </div>
                </div>}
              </div>}
            </div>
            {this.state.showEditDropdown && <div className="dialog-transparent-background" onClick={() => this.toggleMenu()}/>}
            {!this.state.isEditing && !this.props.loading && <div className="message-content">
            <ReactMarkdown
              escapeHtml={false}
              source={formatText(this.props.message.text)}
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
        </div>}
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

const deleteOptionsUser = {
  collectionName: "Users"
}

registerComponent({ name: 'Message', component: Message, hocs: [withCurrentUser, [withSingle, options], [withDelete, deleteOptions], [withDelete, deleteOptionsUser]] });

//noWrapper: bool
//tag: string, default: div