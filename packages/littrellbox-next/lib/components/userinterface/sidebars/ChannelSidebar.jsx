import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../contexts/ChatContext';

const ChannelSidebar = ({ currentUser }) => (
  <ChatContext.Consumer>
    {({planet}) => {
        if(planet != {}) {
          return (
            <div className="channel-sidebar"> 
              {planet.name}
            </div>
          )
        }
      }
    }
  </ChatContext.Consumer>
);

registerComponent({ name: 'ChannelSidebar', component: ChannelSidebar, hocs: [withCurrentUser] });
