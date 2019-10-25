import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../contexts/ChatContext';

const ChannelSidebar = ({ currentUser }) => {
  return (
    <ChatContext.Consumer>
      {({planet}) => {
        if(planet.name) {
          return (
            <div className="channel-sidebar">
              <Components.ChannelHeader planet={planet}/>
              <Components.ChannelList planet={planet} terms={{
                view: 'byPlanetId',
                planetId: planet._id,
                limit: 1000
              }}/>
            </div>
          )
        }
      }}
    </ChatContext.Consumer>
  );
}

registerComponent({ name: 'ChannelSidebar', component: ChannelSidebar, hocs: [withCurrentUser] });
