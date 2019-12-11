import React from 'react'
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUpload} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editUsername: false,
      textboxText: "",
      error: ""
    }
  }

  handleChange(e) {
    this.setState({
      textboxText: e.target.value
    })
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      let documentId = this.props.currentUser._id;
      let username = this.state.textboxText;
      this.props.updateUser({
        selector: {documentId},
        data: {
          username: username
        }
      })
    }
  }

  checkIsBrowserRenderable(filetype) {
    return filetype === "image/jpeg" || filetype === "image/gif" || filetype === "image/png" || filetype === "image/x-icon";

  }

  uploadFile(files) {
    let element = files[0];
    if(!this.checkIsBrowserRenderable(element.type)) {
      this.setState({
        error: "Invalid file type! Supported file types: .JPG, .GIF and .PNG."
      })
    }
    if(element.size > 8*1024*1024) {
      this.setState({
        error: "File too big! Max file size: 8MB."
      })
    }
    const formData = new FormData();
    formData.append('file', element);
    formData.append('folder', "pfp/" + this.props.currentUser._id);
    formData.append('name', element.name);
    axios.post(`/api/aws-upload-endpoint-pfp`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformResponse: res => res
    }).then(response => {
      if(response.data !== "file_too_big" || response.data !== "invalid_file_type") {
        let documentId = this.props.currentUser._id;
        this.props.updateUser({
          selector: {documentId},
          data: {
            lb_profilePicture: response.data
          }
        }).catch(error => {
          console.log(error)
        });
      }
    }).catch(error => {
      console.log(error)
      // handle your error
    });
  }


  onAttachmentButtonClick() {
    this.fileDialog.click();
    this.setState({
      error: ""
    })
  }

  render() {
    let text = this.state.textboxText ? this.state.textboxText : this.props.currentUser.username;
    return (
      <div className="settings-modal" style={this.props.style}>
        <div className="settings-modal-user-info">
          <div className="settings-modal-profile-picture" onClick={() => this.onAttachmentButtonClick()}>
           {this.props.currentUser.lb_profilePicture && <img src={this.props.currentUser.lb_profilePicture} alt="Profile Picture" className="setttings-modal-pfp-image"/>}
            <div className="settings-modal-profile-picture-hover">
              <FontAwesomeIcon icon={faUpload} className="settings-modal-profile-picture-upload"/>
              <input type="file" id="file-dialog" ref={(el) => { this.fileDialog = el; }} style={{display: 'none'}} onChange={(e) => this.uploadFile(e.target.files)}/>
            </div>
          </div>
          <input type="text" className="settings-modal-usertext" value={text} onChange={(e) => this.handleChange(e)} onKeyPress={(e) => this.handleKeyPress(e)}/>
        </div>
        {this.state.error !== "" && <div className="settings-modal-notification">{this.state.error}</div>}
        <Components.AccountsLoginForm redirect={false}/>
      </div>
    )
  }
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'SettingsModal', component: SettingsModal, hocs: [withCurrentUser, [withUpdate, options]] });
