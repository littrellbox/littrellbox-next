import React from 'react';

import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../contexts/ChatContext';

class ChannelSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.context.planet !== nextContext.planet;
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({planet}) => {
          if(planet && planet._id) {
            return (
              <div className="channel-sidebar">
                <Components.ChannelHeader planet={planet}/>
                <Components.ChannelList planet={planet} terms={{
                  view: 'byPlanetId',
                  planetId: planet._id,
                  limit: 2500
                }}/>
              </div>
            )
          } else {
            return (
              <Components.DMSidebar/>
            )
          }
        }}
      </ChatContext.Consumer>
    );
  }
}

ChannelSidebar.contextType = ChatContext;

registerComponent({ name: 'ChannelSidebar', component: ChannelSidebar, hocs: [withCurrentUser] });
