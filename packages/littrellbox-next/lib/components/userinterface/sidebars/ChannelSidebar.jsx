import React from 'react';

import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../contexts/ChatContext';

const ChannelSidebar = ({}) => {
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
};

registerComponent({ name: 'ChannelSidebar', component: ChannelSidebar, hocs: [withCurrentUser] });
