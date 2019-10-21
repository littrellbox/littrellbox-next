import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../../contexts/ChatContext'

import { Picker } from 'emoji-mart'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'

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
      if(this.props.document && this.props.document.userId == this.props.currentUser._id) {
        document = this.props.document
        documentId = document._id
        documentTextSplit = document.text.split("\n")
        documentLastLine = documentTextSplit[documentTextSplit.length - 1]
        text = this.state.textboxText
        if(documentLastLine.startsWith("* ") || documentLastLine.startsWith("+ ") || documentLastLine.startsWith("- "))
          text = "  \n" + this.state.textboxText
        this.props.updateMessage({
          selector: { documentId },
          data: {
            text: document.text + "  \n" + text
          }
        })
      } else {
        this.props.createMessage({
          data: {
            planetId: planet._id,
            channelId: channel._id,
            text: this.state.textboxText.replaceAll("\n", "  \n\n")
          }
        })
      }
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

  addEmoji(e) {
    this.setState({
      textboxText: this.state.textboxText + " :" + e.id.replace("flag-", "") + ":",
      showEmojiPicker: false
    })
  }

  render() {
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
                  set="emojione"
                  title="Pick an emoji!"
                />
              </div>}
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