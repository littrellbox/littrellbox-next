import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const ChannelHeader = ({planet, currentUser}) => (
  <div className="channel-header">
    <div className="channel-header-planet">
      {planet.name}
    </div>
    <div className="channel-header-user">
      {currentUser.username}
    </div>
  </div>
)

registerComponent({ name: 'ChannelHeader', component: ChannelHeader, hocs: [withCurrentUser] });