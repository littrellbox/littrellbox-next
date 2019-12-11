import React from 'react';
import { registerComponent, withMulti, withSingle } from 'meteor/vulcan:core';

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

  let textsplit = document.name.split(" ");
  let text = "";
  textsplit.forEach(element => {
    text = text + element.substring(0,1)
  });

  return (
    <ChatContext.Consumer>
      {({switchPlanet, switchChannel, setPlanetMember}) => (
        <div 
          className="planet-button" 
          onClick={() => {
              switchChannel(results[0]);
              switchPlanet(document);
              setPlanetMember(member)
            }
          }
        >
        {(!document.image && !loading) ? <div className="planet-button-inner">
          {loading ? 
            <CircleLoader/> :
            <div className="planet-button-text">
              {text}
            </div>
          }
          </div> : <img alt={text} className="planet-button-image" src={document.image}/>}
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
};

registerComponent({ name: 'PlanetButton', component: PlanetButton, hocs: [[withSingle, options], [withMulti, optionsMulti]] });
