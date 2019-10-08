import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import './NewPlanetButton'

import '../../../../modules/schemas/planets/collection'

const NewPlanet = ({ currentUser }) => (
  <div className="new-planet"> 
    <Components.ModalTrigger size="large" title="New Planet" component={<div><Components.NewPlanetButton/></div>}>
      <Components.SmartForm
        collectionName="Planets"
      />
    </Components.ModalTrigger>
  </div>
);

registerComponent({ name: 'NewPlanet', component: NewPlanet, hocs: [withCurrentUser] });