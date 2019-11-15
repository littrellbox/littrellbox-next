import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../contexts/ChatContext';

const DMSidebar = ({ currentUser, planet }) => {
  return (
    <div className="channel-sidebar">
      <Components.DMSidebarHeader/>
      <Components.DMHomeButton/>
      <Components.DMList terms={{
        view: 'getDms',
        userId: currentUser._id,
        limit: 2500
      }}/>
    </div>
  );
}

registerComponent({ name: 'DMSidebar', component: DMSidebar, hocs: [withCurrentUser] });
