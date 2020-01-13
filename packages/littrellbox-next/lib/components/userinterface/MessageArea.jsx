import React from 'react';
import { Components, withCurrentUser, registerComponent, withMulti } from 'meteor/vulcan:core';

import { ChatContext } from '../../contexts/ChatContext'

class MessageArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attachments: []
    }
    
  } 

  getUserId(channel) {
    if (!channel.isDm) {
      return ""
    }
    if (channel.dmUserIds.length !== 2) {
      return "" //no document will ever match this
    }
    let arrayInPlace = [...channel.dmUserIds];
    arrayInPlace.splice(channel.dmUserIds.indexOf(this.props.currentUser._id), 1);
    return arrayInPlace
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({channel, attachments, onDrop, removeFile, removeAllFiles}) => {

          if(channel._id && !this.props.loading) {
            return (
              <div className="message-area-container">
                <Components.MessageAreaHeader documentId={this.getUserId(channel)[0]}/>
                <div className="message-area"> 
                 <Components.MessageList 
                   items={this.props.results}
                   channel={channel}
                   count={this.props.count}
                   totalCount={this.props.totalCount}
                   loadMore={() => this.props.loadMore()}
                   planet={this.props.planet}
                 />
                 <Components.MessageTextbox
                   document={this.props.results[0]}
                   channel={channel}
                   documentId={this.getUserId(channel)[0]}
                   addFile={(acceptedFiles) => onDrop(acceptedFiles)}
                   files={attachments}
                   removeItem={(key) => removeFile(key)}
                   removeAllItems={() => removeAllFiles()}
                 />
                </div>
              </div>
            )
          }
          return (
            <div className="message-area ma-height-fix">
              <Components.FeaturedPlanets terms={{
                view: "byFeatured",
                featured: true,
                limit: 10
              }}/>
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

const options = {
  collectionName: "Messages",
  queryOptions: { pollInterval: 500 }
};

registerComponent({ name: 'MessageArea', component: MessageArea, hocs: [withCurrentUser, [withMulti, options]]});