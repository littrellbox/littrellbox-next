import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../../contexts/ChatContext'

import { Picker } from 'emoji-mart'

import MessageTextboxAttachment from './MessageTextboxAttachment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile, faPaperclip } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

class MessageTextbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: "",
      shiftKeyDown: false,
      showEmojiPicker: false
    };
  }
  
  handleKeyPress(e, planet, channel) {
    if (e.key === 'Enter' && !this.state.shiftKeyDown)
      e.preventDefault()
    if (e.key === 'Enter' && !this.state.shiftKeyDown && this.state.textboxText != "") {
      this.props.createMessage({
        data: {
          planetId: planet._id,
          channelId: channel._id,
          text: this.state.textboxText.replaceAll("\n", "  \n\n")
        }
      }).then((value) => {
        this.props.files.forEach(element => {
          console.log(element)
          const formData = new FormData();
          formData.append('file', element);
          formData.append('folder', this.props.channelId + "/" + value.data.createMessage.data._id);
          formData.append('fileType', element.type)
          formData.append('name', element.name)
          axios.post(`/api/aws-upload-endpoint`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            transformResponse: res => res
          }).then(response => {
            console.log(response)
          }).catch(error => {
            // handle your error
          });
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
    this.setState({textboxText: e.target.value});
  }

  onEmojiPickerButtonClick(e) {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  onAttachmentButtonClick() {
    this.fileDialog.click();
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
                  placeholder={"Message #" + this.props.channelName}
                  className="message-textbox-textarea"
                  onKeyDown={(e) => this.handleKeyDown(e)} 
                  onKeyUp={(e) => this.handleKeyUp(e)} 
                  onKeyPress={(e) => this.handleKeyPress(e, planet, channel)} 
                  onChange={(e) => this.onChange(e)} 
                /> 
                <div className="message-textbox-emoji-picker-button">
                  <FontAwesomeIcon icon={faSmile} onClick={() => this.onEmojiPickerButtonClick()}/>
                </div>
                <div className="message-textbox-attachment-button">
                  <FontAwesomeIcon icon={faPaperclip} onClick={() => this.onAttachmentButtonClick()}/>
                  <input type="file" id="file-dialog" ref={(el) => { this.fileDialog = el; }} style={{display: 'none'}} onChange={(e) => this.props.addFile(e.target.files)}/>
                </div>
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

registerComponent({ name: 'MessageTextbox', component: MessageTextbox, hocs: [withCurrentUser, [withCreate, createOptions], [withUpdate, createOptions]] });