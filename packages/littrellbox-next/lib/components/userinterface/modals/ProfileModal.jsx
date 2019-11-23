import React from 'react'
import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComments} from '@fortawesome/free-solid-svg-icons'

import {ChatContext} from '../../../contexts/ChatContext'

class ProfileModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="profile-modal">
        <div className="profile-modal-user-info">
          <div className="profile-modal-profile-picture">
            {this.props.user.lb_profilePicture && <img src={this.props.user.lb_profilePicture} className="profile-modal-pfp-image"/>}
          </div>
          <span className="profile-modal-username">{this.props.user.username}</span>
        </div>
        <div className="profile-buttons">
          <Components.CreateDMButton user={this.props.user} terms={{
            view: 'findDm',
            dmUserIds: [this.props.user._id, this.props.currentUser._id]
          }}/>
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'ProfileModal', component: ProfileModal, hocs: [withCurrentUser] });