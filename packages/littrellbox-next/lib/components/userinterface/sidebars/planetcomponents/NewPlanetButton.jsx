import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const NewPlanetButton = ({ currentUser, onClick }) => (
  <div className="new-planet-button" onClick={onClick}> 
    <div className="new-planet-button-inner">
      +
    </div>
  </div>
);

registerComponent({ name: 'NewPlanetButton', component: NewPlanetButton, hocs: [withCurrentUser] });