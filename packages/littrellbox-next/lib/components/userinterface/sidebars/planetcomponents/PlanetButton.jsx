import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

const PlanetButton = ({withCurrentUser, children}) => {
  return ( 
    <div className="planet-button">
      <div className="planet-button-inner">
        {children}
      </div>
    </div>
  )
};

registerComponent({ name: 'PlanetButton', component: PlanetButton, hocs: [withCurrentUser] });
