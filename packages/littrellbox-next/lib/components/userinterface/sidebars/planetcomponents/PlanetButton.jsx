import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti, withSingle } from 'meteor/vulcan:core';

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
    <div className="planet-button">
      <div className="planet-button-inner">
        {loading ? 
          <Loading/> :
          <div>
            {document.name}
          </div>
        }
      </div>
    </div>
  )
};

const options = {
  collectionName: "Planets"
};

registerComponent({ name: 'PlanetButton', component: PlanetButton, hocs: [withCurrentUser, [withSingle, options]] });
