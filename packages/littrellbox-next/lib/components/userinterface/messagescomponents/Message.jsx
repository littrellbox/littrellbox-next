import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle, withDelete, withUpdate } from 'meteor/vulcan:core';

//formatting
const ReactMarkdown = require('react-markdown/with-html')

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faPencilAlt, faTrash, faUser, faComment, faUpload, faSlash, faCheck } from '@fortawesome/free-solid-svg-icons'

import formatText from '../../lib/FormatText'

import CircleLoader from '../../lib/Loader'

import Tooltip from '../../lib/Tooltip';

class Message extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      showEditDropdown: false,
      isEditing: false
    }
  }

  shouldComponentUpdate(newProps, newState) {
    if(this.state !== newState)
      return true;
    if(this.props.text !== newProps.text)
      return true;
    if(this.props.document !== newProps.document)
      return true;
    return false;
  }

  componentDidUpdate() {
    if(!this.state.showEditDropdown)
      this.props.scrollToBottom();
    if(this.state.isEditing && this.messagesEditBox)
      this.messagesEditBox.scrollIntoView({ behavior: "auto" });
  }

  componentDidMount() {
    //this.props.scrollToBottomMessageMount();
    this.props.scrollToBottom()
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

  muteUser() {
    documentId = this.props.document._id
    if(!this.props.document.lb_muted) {
      this.props.updateUser({
        selector: { documentId },
        data: {
          lb_muted: 1
        }
      })
      return
    }

    setValue = this.props.document.lb_muted == 1 ? 0 : 1
    documentId = this.props.document._id
    this.props.updateUser({
      selector: { documentId },
      data: {
        lb_muted: setValue
      }
    })
  }

  disableUploads() {
    documentId = this.props.document._id
    if(!this.props.document.lb_filesBlocked) {
      this.props.updateUser({
        selector: { documentId },
        data: {
          lb_filesBlocked: 1
        }
      })
      return
    }
    setValue = this.props.document.lb_filesBlocked == 1 ? 0 : 1
    documentId = this.props.document._id
    this.props.updateUser({
      selector: { documentId },
      data: {
        lb_filesBlocked: setValue
      }
    })
  }

  render() {
    document = this.props.document
    if(!this.props.document) {
      document = {
        username: "Unknown User"
      }
    }

    dropdownCondition1 = !this.props.loading && this.props.currentUser._id == this.props.document._id
    dropdownCondition2 = !this.props.loading && this.props.currentUser.isAdmin

    return(
      <div className="message">
        {this.props.loading && <div>
          <CircleLoader/> <span className="loading-text">Loading...</span>
        </div>}
        {!this.props.loading && <div className="message-singular">
          <div>
            <div className="message-header">
              {(dropdownCondition1 || dropdownCondition2) && <div className="message-dropdown" onClick={() => this.toggleMenu()}>
                {this.state.showEditDropdown && <span>
                  {dropdownCondition2 && <span>
                    <Tooltip text="Ban User">
                      <span className="message-dropdown-ban fa-layers fa-fw" onClick={() => this.deleteUser()}>
                        <FontAwesomeIcon icon={faUser}/>  
                        <FontAwesomeIcon icon={faSlash}/> 
                      </span>  
                    </Tooltip>
                    {this.props.document.lb_muted == 1 ? 
                      <Tooltip text="Unmute User">
                        <span className="message-dropdown-unmute fa-layers fa-fw" onClick={() => this.muteUser()}>
                          <FontAwesomeIcon icon={faComment}/>  
                          <FontAwesomeIcon icon={faCheck}/> 
                        </span>
                      </Tooltip> :
                      <Tooltip text="Mute User">
                        <span className="message-dropdown-mute fa-layers fa-fw" onClick={() => this.muteUser()}>
                          <FontAwesomeIcon icon={faComment}/>  
                          <FontAwesomeIcon icon={faSlash}/> 
                        </span>
                      </Tooltip>
                    } 
                    {this.props.document.lb_filesBlocked == 1 ? 
                      <Tooltip text="Enable Files">
                        <span className="message-dropdown-filesenable fa-layers fa-fw"  onClick={() => this.disableUploads()}>
                          <FontAwesomeIcon icon={faUpload}/> 
                          <FontAwesomeIcon icon={faCheck}/>  
                        </span>
                      </Tooltip> : 
                      <Tooltip text="Disable Files">
                        <span className="message-dropdown-filestoggle fa-layers fa-fw"  onClick={() => this.disableUploads()}>
                          <FontAwesomeIcon icon={faUpload}/> 
                          <FontAwesomeIcon icon={faSlash}/>  
                        </span>
                      </Tooltip>
                    }
                    <span className="message-dropdown-splitter"/>
                  </span>}
                  <Tooltip text="Edit">
                    <span className="message-dropdown-edit">
                      <FontAwesomeIcon icon={faPencilAlt} onClick={() => this.toggleEdit()}/>  
                    </span> 
                  </Tooltip> 
                  <Tooltip text="Delete">
                    <span className="message-dropdown-delete" onClick={() => this.deleteMessage()}>
                      <FontAwesomeIcon icon={faTrash}/>  
                    </span> 
                  </Tooltip> 
                </span>}
                <FontAwesomeIcon icon={faEllipsisH}/>
              </div>}
            </div>
            {!this.state.isEditing && !this.props.loading && <div className="message-content">
              <div className="firefox-workaround" onLoad={() => this.componentDidUpdate()}>
                <ReactMarkdown
                  escapeHtml={false}
                  source={formatText(this.props.message.text)}
                  unwrapDisallowed={true}
                  onLoad={() => this.props.scrollToBottom()}
                />
              </div>
              <Components.MessageAttachmentContainer 
                terms={{
                  view: 'byPostId',
                  postId: this.props.message._id,
                  limit: 25
                }}
                forcePositionUpdate={() => this.props.forcePositionUpdate()}
                scrollToBottom={() => this.props.scrollToBottom()}
              />
            </div>}
            {this.state.isEditing && <div className="message-content"> 
              <Components.MessageEditTextbox 
                document={this.props.message} 
                closeEditor={() => this.toggleEdit()}
                scrollToBottom={() => this.props.scrollToBottom()}
              />
              <div ref={(el) => { this.messagesEditBox = el; }}/>
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

registerComponent({ name: 'Message', component: Message, hocs: [withCurrentUser, [withSingle, options], [withDelete, deleteOptions], [withDelete, deleteOptionsUser], [withUpdate, deleteOptionsUser]] });

//noWrapper: bool
//tag: string, default: div