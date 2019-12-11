import React from 'react'
import { registerComponent, withSingle, withCurrentUser } from 'meteor/vulcan:core'

import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { HiddenWithMoveUp, Visible, Hidden, PointerEventsWorkaround } from '../../lib/AnimationStyles'

class MessageFileAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullView: false
    }
  }

  componentDidUpdate() {
    this.props.scrollToBottom()
  }

  componentDidMount() {
    this.props.scrollToBottom()
  }

  downloadFile() {
    this.downloadLink.click()
  }

  toggleFullView() {
    this.setState({
      showFullView: !this.state.showFullView
    })
  }

  createDownloadLink(originalUrl) {
    let urlSplit = originalUrl.split("/");
    let length = urlSplit.length;
    return(window.location + "download/" + urlSplit[length - 3] + "/" + urlSplit[length - 2] + "/" + urlSplit[length - 1])
  }

  render() {
    if(!this.props.loading) {
      if(this.props.document.fileType.startsWith("image/")) {
        return (
          <div className="message-attachment-image">
            <span className="message-attachment-image-name">{this.props.document.fileName}</span>
            <img src={this.props.document.fileUrl} className="message-attachment-image-img" alt="Attachment Image" onClick={() => this.toggleFullView()} onLoad={() => this.props.scrollToBottom()}/>
            <div className="message-attachment-image-fullview" style={this.state.showFullView ? {} : PointerEventsWorkaround}>
              <img src={this.props.document.fileUrl} className="message-attachment-fullview-img" alt="Attachment Image" style={this.state.showFullView ? Visible : HiddenWithMoveUp}/>
              <div className="dialog-semi-transparent-background" style={this.state.showFullView ? Visible : Hidden} onClick={() => this.toggleFullView()}/>
            </div>
          </div>
        )
      } else {
        return (
          <div className="message-attachment-file">
            <span className="message-attachment-filename">{this.props.document.fileName}</span>
            <span className="message-attachment-filedownloadicon" onClick={() => this.downloadFile()}><FontAwesomeIcon icon={faDownload}/></span>
            <a href={this.createDownloadLink(this.props.document.fileUrl)} download ref={(el) => { this.downloadLink = el; }} style={{display: "none"}}/>
          </div>
        )
      }
    }
    return null
  }
}

const options = {
  collectionName: "Files"
};

registerComponent({ name: 'MessageFileAttachment', component: MessageFileAttachment, hocs: [withCurrentUser, [withSingle, options]]});