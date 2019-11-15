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

  getUserId(channel) {
    if (!channel.isDm) {
      return ""
    }
    if (channel.dmUserIds.length != 2) {
      return "" //no document will ever match this
    }
    arrayInPlace = [...channel.dmUserIds]
    arrayInPlace.splice(channel.dmUserIds.indexOf(this.props.currentUser._id), 1)
    return arrayInPlace
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({channel, attachments, onDrop, removeFile, removeAllFiles}) => {

          if(channel._id && !this.props.loading) {
            return (
              <div className="message-area-container">
                <Components.MessageAreaHeader documentId={this.getUserId(channel)}/>
                <div className="message-area"> 
                 <Components.MessageList 
                   items={this.props.results}
                   count={this.props.count}
                   totalCount={this.props.totalCount}
                   loadMore={() => this.props.loadMore()}
                   planet={this.props.planet}
                 />
                 <Components.MessageTextbox
                   channelName={channel.name}
                   channelId={channel._id}
                   document={this.props.results[0]}
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
}

registerComponent({ name: 'MessageArea', component: MessageArea, hocs: [withCurrentUser, [withMulti, options]]});