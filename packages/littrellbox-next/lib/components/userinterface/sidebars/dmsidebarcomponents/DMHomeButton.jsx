import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { ChatContext } from '../../../../contexts/ChatContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

const DMHomeButton = ({ currentUser }) => (
  <ChatContext.Consumer>
    {({clearPlanet, channel}) => {
      if(!channel.name) {
        return (
          <div className="channel-button-active" onClick={() => clearPlanet()}> 
            <div className="channel-button-active-text">
              <FontAwesomeIcon icon={faHome}/> Home
            </div>
          </div>
        )
      } else {
        return (
          <div className="channel-button" onClick={() => switchChannel(this.props.buttonChannel)}>
            <FontAwesomeIcon icon={faHome}/> Home
          </div>
        )
      }
    }}
  </ChatContext.Consumer>
);

registerComponent({ name: 'DMHomeButton', component: DMHomeButton, hocs: [withCurrentUser] });