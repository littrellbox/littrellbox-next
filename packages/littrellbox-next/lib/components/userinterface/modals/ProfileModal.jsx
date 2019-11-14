import React from 'react'
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWindowClose, faUpload} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class ProfileModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
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
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'ProfileModal', component: ProfileModal, hocs: [withCurrentUser, [withUpdate, options]] });