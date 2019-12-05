import React from 'react'
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserSlash} from '@fortawesome/free-solid-svg-icons'

import {ChatContext} from '../../../contexts/ChatContext'

import Tooltip from '../../lib/Tooltip.jsx'

class ProfileModal extends React.Component {
  constructor(props) {
    super(props)
  }

  blockUser() {
    console.log(this.props.currentUser.lb_usersBlocked)
    documentId = this.props.currentUser._id
    arrayToUse = [this.props.user._id]
    if(this.props.currentUser.lb_usersBlocked) {
      arrayToUse = this.props.currentUser.lb_usersBlocked
      if(this.props.currentUser.lb_usersBlocked.includes(this.props.user._id))
        arrayToUse.splice(this.props.currentUser.lb_usersBlocked.indexOf(this.props.user._id), 1)
      else
        arrayToUse.push(this.props.user._id)
    }
    this.props.updateUser({
      selector: {documentId},
      data: {
        lb_usersBlocked: arrayToUse
      }
    })
  }

  render() {
    tooltipText = "Block User"
    if(this.props.user && this.props.currentUser.lb_usersBlocked && this.props.currentUser.lb_usersBlocked.includes(this.props.user._id))
      tooltipText = "Unblock User"
    return (
      <div className="profile-modal" style={this.props.style}>
        {this.props.user && <div> 
          <div className="profile-modal-user-info">
            <div className="profile-modal-profile-picture">
              {this.props.user.lb_profilePicture && <img src={this.props.user.lb_profilePicture} className="profile-modal-pfp-image"/>}
            </div>
            <span className="profile-modal-username">{this.props.user.username}</span>
          </div>
          <div className="profile-buttons">
            {this.props.user._id != this.props.currentUser._id && <Tooltip text={tooltipText}><FontAwesomeIcon className="profile-button-block" icon={faUserSlash} onClick={() => this.blockUser()}/></Tooltip>}
            {this.props.user._id != this.props.currentUser._id && <Components.CreateDMButton user={this.props.user} terms={{
              view: 'findDm',
              dmUserIds: [this.props.user._id, this.props.currentUser._id]
            }}/>}
          </div>
        </div>}
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'ProfileModal', component: ProfileModal, hocs: [withCurrentUser, [withUpdate, options]] });
