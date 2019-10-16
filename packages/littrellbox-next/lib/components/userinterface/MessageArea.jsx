import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';

import { ChatContext } from '../../contexts/ChatContext'

import './messagescomponents/MessageList'
import './messagescomponents/MessageTextbox'

class MessageArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({channel, planet}) => {
          if(channel._id && !this.props.loading) {
            return (
              <div className="message-area"> 
                <Components.MessageList items={this.props.results}/>
                <Components.MessageTextbox
                  channelName={channel.name}
                  document={this.props.results[0]}
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

const options = {
  collectionName: "Messages",
  queryOptions: { pollInterval: 200 }
}

registerComponent({ name: 'MessageArea', component: MessageArea, hocs: [withCurrentUser, [withMulti, options]]});
//[withMulti, multiOptions], [withCreate, createOptions]