import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withSingle } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../../contexts/ChatContext'

import { Picker } from 'emoji-mart'

import MessageTextboxAttachment from './MessageTextboxAttachment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile, faPaperclip } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';
import Files from '../../../modules/schemas/files/collection';

class MessageTextbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: "",
      shiftKeyDown: false,
      showEmojiPicker: false,
      fileTooBig: false
    };
  }
  
  handleKeyPress(e, planet, channel) {
    if (e.key === 'Enter' && !this.state.shiftKeyDown)
      e.preventDefault()
    if (e.key === 'Enter' && !this.state.shiftKeyDown && (this.state.textboxText != "" || this.props.files.length != 0)) {
      this.props.createMessage({
        data: {
          planetId: planet._id,
          channelId: channel._id,
          text: this.state.textboxText.replaceAll("\n", "  \n\n")
        }
      }).then((value) => {
        filesToUpload = this.props.files
        this.props.removeAllItems()
        filesToUpload.forEach(element => {
          if(element.size > 8*1024*1024) {
            this.setState({
              fileTooBig: true
            })
          } else {   
            const formData = new FormData();
            formData.append('file', element);
            formData.append('folder', this.props.channel._id + "/" + value.data.createMessage.data._id);
            formData.append('fileType', element.type)
            formData.append('name', element.name)
            axios.post(`/api/aws-upload-endpoint`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              transformResponse: res => res
            }).then(response => {
              if(response.data != "file_too_big") {
                this.props.createFile({
                  data: {
                    fileName: element.name,
                    fileUrl: response.data,
                    fileType: element.type
                  }
                }).then(fileValue => {
                  this.props.createAttachment({
                    data: {
                      postId: value.data.createMessage.data._id,
                      type: "file",
                      attachmentId: fileValue.data.createFile.data._id 
                    }
                  })
                })
              }
            }).catch(error => {
              // handle your error
            });
          }
        })
      }) 
      this.setState({textboxText: ""})
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Shift') {
      this.setState({shiftKeyDown: true})
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Shift') {
      this.setState({shiftKeyDown: false})
    }
  }

  onChange(e) {
    if (this.state.fileTooBig) {
      this.setState({
        fileTooBig: false
      })
    }
    this.setState({textboxText: e.target.value});
  }

  onEmojiPickerButtonClick(e) {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  onAttachmentButtonClick() {
    this.fileDialog.click();
    this.setState({
      fileTooBig: false
    })
  }

  addEmoji(e) {
    this.setState({
      textboxText: this.state.textboxText + " :" + e.id + ":",
      showEmojiPicker: false
    })
  }

  render() {
    messageAttachments = []
    for(i = 0; i < this.props.files.length; i++) {
      messageAttachments.push({
        file: this.props.files[i],
        key: i
      })
    }

    addAttachmentClassName = "message-textbox-attachment-button"
    placeholderText = "Message #" + this.props.channel.name
    if (this.props.channel.isDm) {
      placeholderText = "Message " + this.props.channel.name
    }
    if (this.props.channel.isDm && this.props.channel.dmUserIds.length == 2 && this.props.document && this.props.document.username) {
      placeholderText = "Message " + this.props.document.username
    }
    if (this.props.currentUser.lb_muted == 1) {
      placeholderText = "You've been muted."
    }
    if (this.state.fileTooBig) {
      placeholderText = "File was too big to upload! Max size: 8MB."
      addAttachmentClassName = "message-textbox-attachment-button-toobig"
    }

    return (
      <ChatContext.Consumer>
        {({channel, planet}) => {
          return(
            <div>
              {this.state.showEmojiPicker && <div className="dialog-transparent-background" onClick={() => this.onEmojiPickerButtonClick()}/> }
              {this.state.showEmojiPicker && <div className="message-textbox-emoji-picker">
                <Picker 
                  onSelect={(e) => this.addEmoji(e)} 
                  native={false}
                  set="twitter"
                  title="Pick an emoji!"
                />
              </div>}
              <div className="message-textbox-attachments">
                {messageAttachments.map((fileObject) => <MessageTextboxAttachment key={fileObject.key} index={fileObject.key} file={fileObject.file} removeItem={(key) => this.props.removeItem(key)}/>)}
              </div>
              <div className="message-textbox">
                <Textarea 
                  value={this.state.textboxText} 
                  rows="1" 
                  tabIndex="1" 
                  placeholder={placeholderText}
                  className="message-textbox-textarea"
                  onKeyDown={(e) => this.handleKeyDown(e)} 
                  onKeyUp={(e) => this.handleKeyUp(e)} 
                  onKeyPress={(e) => this.handleKeyPress(e, planet, channel)} 
                  onChange={(e) => this.onChange(e)} 
                  disabled={this.props.currentUser.lb_muted == 1}
                /> 
                {this.props.currentUser.lb_muted != 1 && <div className="message-textbox-emoji-picker-button">
                  <FontAwesomeIcon icon={faSmile} onClick={() => this.onEmojiPickerButtonClick()}/>
                </div>}
                {this.props.currentUser.lb_muted != 1 && this.props.currentUser.lb_filesBlocked != 1 && <div className={addAttachmentClassName}>
                  <FontAwesomeIcon icon={faPaperclip} onClick={() => this.onAttachmentButtonClick()}/>
                  <input type="file" id="file-dialog" multiple ref={(el) => { this.fileDialog = el; }} style={{display: 'none'}} onChange={(e) => this.props.addFile(e.target.files)}/>
                </div>}
              </div>
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

const createOptions = {
  collectionName: "Messages"
};

const createAttachmentOptions = {
  collectionName: "Attachments"
}

const options = {
  collectionName: "Users"
}

const createFileOptions = {
  collectionName: "Files"
}

registerComponent({ name: 'MessageTextbox', component: MessageTextbox, hocs: [withCurrentUser, [withSingle, options], [withCreate, createOptions], [withCreate, createFileOptions], [withCreate, createAttachmentOptions], [withUpdate, createOptions]] });