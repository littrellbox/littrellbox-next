import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const ChannelButton = ({channel, currentUser}) => (
  <div className="channel-button">
    #{channel.name}
  </div>
)

registerComponent({ name: 'ChannelButton', component: ChannelButton, hocs: [withCurrentUser] });