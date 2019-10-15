import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../contexts/ChatContext'

import './messagescomponents/MessageList'

class MessageArea extends React.Component {
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
      if(this.props.results.length != 0 && this.props.results[0].userId == this.props.currentUser._id) {
        document = this.props.results[0]
        documentId = document._id
        this.props.updateMessage({
          selector: { documentId },
          data: {
            text: document.text + "  \n" + this.state.textboxText
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
          if(channel._id) {
            return (
              <div className="message-area"> 
                <Components.MessageList terms={{
                  view: 'byChannel',
                  channelId: channel._id,
                  limit: 100
                }}/>
                <Textarea 
                  value={this.state.textboxText} 
                  rows="1" 
                  tabIndex="1" 
                  placeholder={"Message #" + channel.name} 
                  className="message-textbox" 
                  onKeyDown={(e) => this.handleKeyDown(e)} 
                  onKeyUp={(e) => this.handleKeyUp(e)} 
                  onKeyPress={(e) => this.handleKeyPress(e, planet, channel)} 
                  onChange={(e) => this.onChange(e)} 
                /> 
              </div>
            )
          }
          return (
            <div className="message-area">
              <Components.AccountsLoginForm redirect={false}/>
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

const options = {
  collectionName: "Messages"
}

registerComponent({ name: 'MessageArea', component: MessageArea, hocs: [withCurrentUser, [withMulti, options], [withCreate, createOptions], [withUpdate, createOptions]] });
//[withMulti, multiOptions], [withCreate, createOptions]