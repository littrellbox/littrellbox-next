import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';
import Textarea from 'react-textarea-autosize';

import { ChatContext } from '../../contexts/ChatContext'

import './messagescomponents/MessageList'

class MessageArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: ""
    };
  }
  
  handleKeyPress(e, planet, channel) {
    if (e.key === 'Enter') {
      this.props.createMessage({
        data: {
          planetId: planet._id,
          channelId: channel._id,
          text: this.state.textboxText
        }
      })
      this.setState({textboxText: ""})
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
                <Textarea value={this.state.textboxText} rows="1" tabindex="1" placeholder={"Message #" + channel.name} className="message-textbox" onKeyPress={(e) => this.handleKeyPress(e, planet, channel)} onChange={(e) => this.onChange(e)} /> 
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

registerComponent({ name: 'MessageArea', component: MessageArea, hocs: [withCurrentUser, [withCreate, createOptions]] });
//[withMulti, multiOptions], [withCreate, createOptions]