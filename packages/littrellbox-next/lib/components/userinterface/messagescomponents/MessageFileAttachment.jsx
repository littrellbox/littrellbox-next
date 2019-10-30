import React from 'react'
import { Components, registerComponent, withSingle, withCurrentUser } from 'meteor/vulcan:core'

import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MessageFileAttachment extends React.Component {
  constructor(props) {
    super(props)
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

  createDownloadLink(originalUrl) {
    urlSplit = originalUrl.split("/")
    length = urlSplit.length
    return(window.location + "download/" + urlSplit[length - 3] + "/" + urlSplit[length - 2] + "/" + urlSplit[length - 1])
  }

  render() {
    if(!this.props.loading) {
      if(this.props.document.fileType.startsWith("image/")) {
        return (
          <div className="message-attachment-image">
            <span className="message-attachment-image-name">{this.props.document.fileName}</span>
            <img src={this.props.document.fileUrl} className="message-attachment-image-img" onLoad={() => this.props.scrollToBottom()}/>
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
      return null
    }
    return null
  }
}

const options = {
  collectionName: "Files"
}

registerComponent({ name: 'MessageFileAttachment', component: MessageFileAttachment, hocs: [withCurrentUser, [withSingle, options]]})