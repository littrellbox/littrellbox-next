import React from 'react'
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWindowClose} from '@fortawesome/free-solid-svg-icons'

class AboutModal extends React.Component {
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
      <div className="about-modal">
        <div className="about-header">
          Littrellbox
        </div>
        <div className="about-version">
          Alpha 1
        </div>
        <div className="about-copyright">
          © 2019 Littrellbox. Portions of this software are licensed<br/>
          under various open source licenses.
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'AboutModal', component: AboutModal, hocs: [withCurrentUser] });