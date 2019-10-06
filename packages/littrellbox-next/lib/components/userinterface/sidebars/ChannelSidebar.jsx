import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const ChannelSidebar = ({ currentUser }) => (
  <div className="channel-sidebar"> 

  </div>
);

registerComponent({ name: 'ChannelSidebar', component: ChannelSidebar, hocs: [withCurrentUser] });
