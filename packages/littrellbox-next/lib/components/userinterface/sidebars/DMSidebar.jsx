import React from 'react';

import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const DMSidebar = ({ currentUser }) => {
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
};

registerComponent({ name: 'DMSidebar', component: DMSidebar, hocs: [withCurrentUser] });
