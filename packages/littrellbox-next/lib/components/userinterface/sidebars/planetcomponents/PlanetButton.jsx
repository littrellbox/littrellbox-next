import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti, withSingle } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'

const PlanetButton = ({withCurrentUser, document, loading}) => {
  if(!document) {
    return (
      <div className="planet-button">
        <div className="planet-button-inner">
          ?
        </div>
      </div>
    )
  }

  return (
    <ChatContext.Consumer>
      {({switchPlanet}) => (
        <div className="planet-button" onClick={() => switchPlanet(document)}>
          <div className="planet-button-inner">
            {loading ? 
              <Loading/> :
              <div>
                {document.name}
              </div>
            }
          </div>
        </div>
      )}
    </ChatContext.Consumer>
  )
};

const options = {
  collectionName: "Planets"
};

registerComponent({ name: 'PlanetButton', component: PlanetButton, hocs: [withCurrentUser, [withSingle, options]] });
