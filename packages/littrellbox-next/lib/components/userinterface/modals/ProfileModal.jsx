import React from 'react'
import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComments} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class ProfileModal extends React.Component {
  constructor(props) {
    super(props)
  }

  createDM() {
    this.props.createChannel({
      data: {
        name: "directm",
        isDm: true,
        dmUserIds: [this.props.currentUser._id, this.props.user._id]
      }
    })
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
          <div className="profile-button-dm" onClick={() => this.createDM()}>
            <FontAwesomeIcon icon={faComments}/>
          </div>
        </div>
      </div>
    )
  }
}

const options = {
  collectionName: "Channels"
}

registerComponent({ name: 'ProfileModal', component: ProfileModal, hocs: [withCurrentUser, [withCreate, options]] });