import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../contexts/ChatContext';

const DMSidebar = ({ currentUser, planet }) => {
  return (
    <div className="channel-sidebar">
      <Components.DMSidebarHeader/>
      <Components.DMHomeButton/>
      <Components.DMList/>
      {/*<Components.ChannelList planet={planet} terms={{
        view: 'byPlanetId',
        planetId: planet._id,
        limit: 1000
      }}/>*/}
    </div>
  );
}

registerComponent({ name: 'DMSidebar', component: DMSidebar, hocs: [withCurrentUser] });