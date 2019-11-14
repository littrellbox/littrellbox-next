import React from 'react'
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWindowClose, faUpload} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class ProfileModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editUsername: false,
      textboxText: "",
      error: ""
    }
  }

  render() {
    text = this.state.textboxText
    if(text == "") {
      text = this.props.currentUser.username
    }
    return (
      <div className="profile-modal">
        <div className="profile-modal-user-info">
          <div className="profile-modal-profile-picture" onClick={() => this.onAttachmentButtonClick()}>
            {this.props.user.lb_profilePicture && <img src={this.props.user.lb_profilePicture} className="profile-modal-pfp-image"/>}
          </div>
          <span className="profile-modal-username">{this.props.user.username}</span>
        </div>
        <Components.AccountsLoginForm redirect={false}/>
        <div className="btn close-button">
          <FontAwesomeIcon icon={faWindowClose} onClick={() => this.props.toggleSettings()}/>
        </div>
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'ProfileModal', component: ProfileModal, hocs: [withCurrentUser, [withUpdate, options]] });