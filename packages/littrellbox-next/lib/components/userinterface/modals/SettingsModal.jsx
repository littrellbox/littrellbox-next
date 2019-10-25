import React from 'react'
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWindowClose} from '@fortawesome/free-solid-svg-icons'

class SettingsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editUsername: false,
      textboxText: ""
    }
  }

  handleChange(e) {
    this.setState({
      textboxText: e.target.value
    })
  }

  handleKeyPress(e) {
    if (e.key == "Enter") {
      documentId = this.props.currentUser._id
      username = this.state.textboxText
      this.props.updateUser({
        selector: {documentId},
        data: {
          username: username
        }
      })
    }
  }

  render() {
    text = this.state.textboxText
    if(text == "") {
      text = this.props.currentUser.username
    }
    return (
      <div className="settings-modal">
        <input type="text" className="settings-modal-usertext" value={text} onChange={(e) => this.handleChange(e)} onKeyPress={(e) => this.handleKeyPress(e)}/>
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

registerComponent({ name: 'SettingsModal', component: SettingsModal, hocs: [withCurrentUser, [withUpdate, options]] });