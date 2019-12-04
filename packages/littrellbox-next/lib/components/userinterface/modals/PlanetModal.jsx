import React from 'react'
import { Components, withCurrentUser, registerComponent, withUpdate, withDelete } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWindowClose, faUpload} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class PlanetModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editUsername: false,
      textboxText: this.props.planet.name,
      error: ""
    }
  }

  handleChange(e) {
    this.setState({
      textboxText: e.target.value
    })
  }

  handleKeyPress(e) {
    if (e.key == "Enter") {
      documentId = this.props.planet._id
      name = this.state.textboxText
      this.props.updatePlanet({
        selector: {documentId},
        data: {
          name: name
        }
      })
    }
  }

  checkIsBrowserRenderable(filetype) {
    if(filetype == "image/jpeg" || filetype == "image/gif" || filetype == "image/png" || filetype == "image/x-icon")
      return true
    return false
  }

  uploadFile(files) {
    element = files[0]
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
    formData.append('folder', "planetpic/" + this.props.planet._id);
    formData.append('name', element.name)
    axios.post(`/api/aws-upload-endpoint-planetpic`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformResponse: res => res
    }).then(response => {
      if(response.data != "file_too_big" || response.data != "invalid_file_type") {
        documentId = this.props.planet._id
        this.props.updatePlanet({
          selector: {documentId},
          data: {
            image: response.data
          }
        }).catch(error => {
          console.log(error)
        });
      }
    }).catch(error => {
      // handle your error
    });
  }


  onAttachmentButtonClick() {
    this.fileDialog.click();
    this.setState({
      error: ""
    })
  }

  deletePlanet() {
    documentId = this.props.planet._id
    this.props.deletePlanet({documentId})
    console.log("planet-deleted")
  }

  render() {
    text = this.state.textboxText

    return (
      <div className="settings-modal" style={this.props.style}>
        {
          //we are essentially rendering the same thing here, no need to duplicate classes
        }
        <div className="settings-modal-user-info">
          <div className="settings-modal-profile-picture" onClick={() => this.onAttachmentButtonClick()}>
           {this.props.planet.image && <img src={this.props.planet.image} className="setttings-modal-pfp-image"/>}
            <div className="settings-modal-profile-picture-hover">
              <FontAwesomeIcon icon={faUpload} className="settings-modal-profile-picture-upload"/>
              <input type="file" id="file-dialog" ref={(el) => { this.fileDialog = el; }} style={{display: 'none'}} onChange={(e) => this.uploadFile(e.target.files)}/>
            </div>
          </div>
          <input type="text" className="settings-modal-usertext" value={text} onChange={(e) => this.handleChange(e)} onKeyPress={(e) => this.handleKeyPress(e)}/>
        </div>
        {this.state.error != "" && <div className="settings-modal-notification">{this.state.error}</div>}
        <div className="buttons">
          <div>
            <div className="btn button-red" onClick={() => this.deletePlanet()}>
              Delete Planet
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const options = {
  collectionName: "Planets"
}

registerComponent({ name: 'PlanetModal', component: PlanetModal, hocs: [withCurrentUser, [withUpdate, options], [withDelete, options]] });
