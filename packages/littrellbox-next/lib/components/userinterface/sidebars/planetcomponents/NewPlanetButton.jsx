import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const NewPlanetButton = ({ currentUser, onClick }) => (
  <div className="new-planet-button" onClick={onClick}> 
    <div className="new-planet-button-inner">
      <FontAwesomeIcon icon={faPlus}/>
    </div>
  </div>
);

registerComponent({ name: 'NewPlanetButton', component: NewPlanetButton, hocs: [withCurrentUser] });