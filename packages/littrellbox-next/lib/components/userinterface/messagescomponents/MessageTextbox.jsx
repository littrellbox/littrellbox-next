import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../../contexts/ChatContext'

class MessageTextbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: "",
      shiftKeyDown: false
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

  onChange(event) {
    this.setState({textboxText: event.target.value});
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({channel, planet}) => {
          return(
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