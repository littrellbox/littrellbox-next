import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate, withMulti } from 'meteor/vulcan:core';

import { ChatContext } from '../../contexts/ChatContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faSmile } from '@fortawesome/free-solid-svg-icons'

class MessageArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attachments: []
    }
    
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({channel, attachments, onDrop, removeFile}) => {

          if(channel._id && !this.props.loading) {
            return (
              <div className="message-area"> 
                <Components.MessageList items={this.props.results}/>
                <Components.MessageTextbox
                  channelName={channel.name}
                  channelId={channel._id}
                  document={this.props.results[0]}
                  addFile={(acceptedFiles) => onDrop(acceptedFiles)}
                  files={attachments}
                  removeItem={(key) => removeFile(key)}
                />
              </div>
            )
          }
          return (
            <div className="message-area">
              
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