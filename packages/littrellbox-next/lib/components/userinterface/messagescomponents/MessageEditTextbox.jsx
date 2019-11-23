import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../../contexts/ChatContext'

import { Picker } from 'emoji-mart'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'

class MessageEditTextbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: "",
      shiftKeyDown: false,
      showEmojiPicker: false,
      hasBeenUpdated: false
    };
  }

  componentDidUpdate() {
    this.props.scrollToBottom();
  }
  
  componentDidMount() {
    this.props.scrollToBottom();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !this.state.shiftKeyDown)
      e.preventDefault()
    if (e.key === 'Enter' && !this.state.shiftKeyDown && this.state.textboxText != "") {
      document = this.props.document
      documentId = document._id

      this.props.updateMessage({
        selector: { documentId },
        data: {
          //i'm gonna be 100% honest with you i have absolutely no clue where this variable came from
          text: text
        }
      })
    }
    if (e.key === 'Enter' && !this.state.shiftKeyDown) {
      this.props.closeEditor();
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
    this.setState({
      textboxText: e.target.value,
      hasBeenUpdated: true
    });
  }

  onEmojiPickerButtonClick(e) {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  addEmoji(e) {
    this.setState({
      textboxText: this.state.textboxText + " :" + e.id + ":",
      showEmojiPicker: false
    })
  }

  render() {
    text = this.state.textboxText
    if (text == "" && !this.state.hasBeenUpdated) {
      text = this.props.document.text
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
              <div className="message-textbox">
                <Textarea 
                  value={text} 
                  rows="1" 
                  tabIndex="1"
                  className="message-textbox-textarea"
                  onKeyDown={(e) => this.handleKeyDown(e)} 
                  onKeyUp={(e) => this.handleKeyUp(e)} 
                  onKeyPress={(e) => this.handleKeyPress(e)} 
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

registerComponent({ name: 'MessageEditTextbox', component: MessageEditTextbox, hocs: [withCurrentUser, [withUpdate, createOptions]] });