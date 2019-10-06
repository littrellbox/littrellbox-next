import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const PlanetSidebar = ({ currentUser }) => (
  <div className="planet-sidebar"> 

  </div>
);

registerComponent({ name: 'PlanetSidebar', component: PlanetSidebar, hocs: [withCurrentUser] });
