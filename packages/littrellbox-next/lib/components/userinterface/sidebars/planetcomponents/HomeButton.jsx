import React from 'react';

import { withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { ChatContext } from '../../../../contexts/ChatContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

class HomeButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ChatContext.Consumer>
        {({clearPlanet}) => {
          return(
            <div className="planet-button" onClick={() => clearPlanet()}>
              <div className="home-button-inner">
                <FontAwesomeIcon icon={faHome}/>
              </div>
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

registerComponent({ name: 'HomeButton', component: HomeButton, hocs: [withCurrentUser] });