import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withMulti, withSingle } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'

import CircleLoader from '../../../lib/Loader'

const PlanetButton = ({member, document, loading, results = []}) => {
  if(!document) {
    return (
      <div className="planet-button">
        <div className="planet-button-inner">
          ?
        </div>
      </div>
    )
  }

  textsplit = document.name.split(" ")
  text = ""
  textsplit.forEach(element => {
    text = text + element.substring(0,1)
  });

  return (
    <ChatContext.Consumer>
      {({switchPlanet, switchChannel, setPlanetMember}) => (
        <div 
          className="planet-button" 
          onClick={() => {
              switchChannel(results[0])
              switchPlanet(document)
              setPlanetMember(member)
            }
          }
        >
          <div className="planet-button-inner">
            {loading ? 
              <CircleLoader/> :
              <div className="planet-button-text">
                {text}
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

const optionsMulti = {
  collectionName: "Channels"
}

registerComponent({ name: 'PlanetButton', component: PlanetButton, hocs: [[withSingle, options], [withMulti, optionsMulti]] });
