import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'

const ChannelButton = ({buttonChannel, currentUser}) => (
  <ChatContext.Consumer>
    {({channel, switchChannel}) => {
      if(!buttonChannel) {
        buttonChannel = {
          name: "Loading..."
        }
      }
      if(channel == buttonChannel) {
        return(
          <div className="channel-button-active" onClick={() => switchChannel(buttonChannel)}>
            #{buttonChannel.name}
          </div>
        )
      }
      return(
        <div className="channel-button" onClick={() => switchChannel(buttonChannel)}>
          #{buttonChannel.name}
        </div>
      )
    }}
  </ChatContext.Consumer>
)

registerComponent({ name: 'ChannelButton', component: ChannelButton, hocs: [withCurrentUser] });