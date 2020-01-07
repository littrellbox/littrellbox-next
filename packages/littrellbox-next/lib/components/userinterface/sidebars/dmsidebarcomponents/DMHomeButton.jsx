import React from 'react';

import { withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { ChatContext } from '../../../../contexts/ChatContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

class DMHomeButton extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.context.channel !== nextContext.channel;
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({clearPlanet, channel}) => {
          if(!channel.name) {
            return (
              <div className="channel-button-active dm-sidebar-home dm-button">
                <div className="channel-button-active-text">
                  <FontAwesomeIcon icon={faHome}/> Home
                </div>
              </div>
            )
          } else {
            return (
              <div className="channel-button dm-sidebar-home dm-button" onClick={() => {console.log("a"); clearPlanet()}}>
                <FontAwesomeIcon icon={faHome}/> Home
              </div>
            )
          }
        }}
      </ChatContext.Consumer>
    )
  }
}

DMHomeButton.contextType = ChatContext;

registerComponent({ name: 'DMHomeButton', component: DMHomeButton, hocs: [withCurrentUser] });