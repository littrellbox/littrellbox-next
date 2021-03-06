import React from 'react';
import { withCurrentUser, registerComponent, withCreate, withUpdate, withSingle } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../../contexts/ChatContext'

import { Picker } from 'emoji-mart'

import MessageTextboxAttachmentMenu from "./mtcomponents/MessageTextboxAttachmentMenu";
import MessageTextboxAttachment from './mtcomponents/MessageTextboxAttachment'
import MessageTextboxGenericAttachment from './mtcomponents/MessageTextboxGenericAttachment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import {HiddenWithMoveUp, Visible} from '../../lib/AnimationStyles'

import axios from 'axios';
import Files from '../../../modules/schemas/files/collection';

class MessageTextbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: "",
      shiftKeyDown: false,
      showEmojiPicker: false,
      fileTooBig: false,
      showAttachments: false,
      attachmentsArray: []
    };
  }

  addAttachment(attachment) {
    let attachmentsArray = this.state.attachmentsArray;
    attachmentsArray.push(attachment);
    this.setState({
      attachmentsArray: attachmentsArray
    })
    console.log("bruh")
  }

  clearAttachments() {
    this.setState({
      attachmentsArray: []
    })
  }

  removeAttachment(index) {
    let attachmentsArray = this.state.attachmentsArray;
    attachmentsArray.splice(index, 1);
    this.setState({
      attachmentsArray: attachmentsArray
    })
  }

  shouldComponentUpdate(newProps, newState) {
    if(this.state !== newState)
      return true;
    if(this.props.document && newProps.document && this.props.document.username !== newProps.document.username)
      return true;
    if(this.props.channel.name !== newProps.channel.name)
      return true;
    if(this.props.channel._id !== newProps.channel._id)
      return true;
    if(this.props.attachments !== newProps.files)
      return true;
    return typeof (this.props.document) !== typeof (this.props.document);

  } 

  handleKeyPress(e, planet, channel) {
    if (e.key === 'Enter' && !this.state.shiftKeyDown)
      e.preventDefault();
    if (e.key === 'Enter' && !this.state.shiftKeyDown && (this.state.textboxText !== "" || this.props.files.length !== 0)) {
      let pinged = [];
      let search1 = this.state.textboxText.match(/(\s@[A-Za-z0-9_])\w+/g);
      let search2 = this.state.textboxText.match(/(^@[A-Za-z0-9_])\w+/g);
      if(search1)
        for(const ping of search1) {
          pinged.push(ping.substring(2, ping.length))
        }
      if(search2)
        for(const ping of search2) {
          pinged.push(ping.substring(1, ping.length))
        }
      this.props.createMessage({
        data: {
          planetId: planet._id,
          channelId: channel._id,
          text: this.state.textboxText,
          pings: pinged
        }
      }).then((value) => {
        //handle adding misc attachments
        for(const attachment of this.state.attachmentsArray) {
          this.props.createAttachment({
            data: {
              postId: value.data.createMessage.data._id,
              type: attachment.type,
              attachmentId: attachment.id
            }
          })
        }
        this.clearAttachments();
        //handle uploading files
        let filesToUpload = this.props.files;
        this.props.removeAllItems();
        filesToUpload.forEach(element => {
          if(element.size > 8*1024*1024) {
            this.setState({
              fileTooBig: true
            })
          } else {   
            const formData = new FormData();
            formData.append('file', element);
            formData.append('folder', this.props.channel._id + "/" + value.data.createMessage.data._id);
            formData.append('fileType', element.type);
            formData.append('name', element.name);
            axios.post(`/api/aws-upload-endpoint`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              transformResponse: res => res
            }).then(response => {
              if(response.data !== "file_too_big") {
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
              console.log(error)
              // handle your error
            });
          }
        })
      });
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

  onEmojiPickerButtonClick() {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  onAttachmentButtonClick() {
    this.setState({
      showAttachments: !this.state.showAttachments,
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
    let messageAttachments = [];
    for(i = 0; i < this.props.files.length; i++) {
      messageAttachments.push({
        file: this.props.files[i],
        key: i
      })
    }

    let addAttachmentClassName = "message-textbox-attachment-button";
    let placeholderText = "Message #" + this.props.channel.name;
    if (this.props.channel.isDm) {
      placeholderText = "Message " + this.props.channel.name
    }
    if (this.props.channel.isDm && this.props.channel.dmUserIds.length === 2 && this.props.document && this.props.document.username) {
      placeholderText = "Message " + this.props.document.username
    }
    if (this.props.currentUser.lb_muted === 1) {
      placeholderText = "You've been muted."
    }
    if (this.state.fileTooBig) {
      placeholderText = "File was too big to upload! Max size: 8MB.";
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
              {(messageAttachments.length > 0 || this.state.attachmentsArray.length > 0) && <div className="message-textbox-attachments">
                {messageAttachments.map((fileObject) => <MessageTextboxAttachment key={fileObject.key} index={fileObject.key} file={fileObject.file} removeItem={(key) => this.props.removeItem(key)}/>)}
                {this.state.attachmentsArray.map((attachmentObject, index) => <MessageTextboxGenericAttachment key={index} index={index} attachment={attachmentObject} removeItem={(index) => this.removeAttachment(index)}/>)}
              </div>}
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
                  disabled={this.props.currentUser.lb_muted === 1}
                /> 
                {this.props.currentUser.lb_muted !== 1 && <div className="message-textbox-emoji-picker-button">
                  <FontAwesomeIcon icon={faSmile} onClick={() => this.onEmojiPickerButtonClick()}/>
                </div>}
                {this.props.currentUser.lb_muted !== 1 && this.props.currentUser.lb_filesBlocked !== 1 && <div className={addAttachmentClassName}>
                  <FontAwesomeIcon icon={faPlusCircle} onClick={() => this.onAttachmentButtonClick()}/>
                  {this.state.showAttachments && <div className="dialog-transparent-background" onClick={() => this.onAttachmentButtonClick()}/>}
                  <MessageTextboxAttachmentMenu addFile={(file) => this.props.addFile(file)} style={this.state.showAttachments ? Visible : HiddenWithMoveUp} addAttachment={(attachment) => this.addAttachment(attachment)} toggleAttachments={() => this.onAttachmentButtonClick()}/>
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
};

const options = {
  collectionName: "Users"
};

const createFileOptions = {
  collectionName: "Files"
};

registerComponent({ name: 'MessageTextbox', component: MessageTextbox, hocs: [withCurrentUser, [withSingle, options], [withCreate, createOptions], [withCreate, createFileOptions], [withCreate, createAttachmentOptions], [withUpdate, createOptions]] });
