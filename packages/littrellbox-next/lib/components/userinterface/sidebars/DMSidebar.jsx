import React from 'react';

import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

class DMSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.currentUser._id !== nextProps.currentUser._id;
  }

  render() {
    return (
      <div className="channel-sidebar">
        <Components.DMSidebarHeader/>
        <Components.DMHomeButton/>
        <Components.DMList terms={{
          view: 'getDms',
          userId: this.props.currentUser._id,
          limit: 2500
        }}/>
      </div>
    );
  }
}

registerComponent({ name: 'DMSidebar', component: DMSidebar, hocs: [withCurrentUser] });
