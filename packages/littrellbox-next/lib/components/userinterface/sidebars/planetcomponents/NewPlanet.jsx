import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';

import './NewPlanetButton'

import '../../../../modules/schemas/planets/collection'

const NewPlanet = ({ currentUser, createPlanetMember, createChannel, closeModal }) => (
  <div className="new-planet"> 
    <Components.ModalTrigger size="large" title="New Planet" component={<div><Components.NewPlanetButton/></div>}>
      <Components.SmartForm
        collectionName="Planets"
        successCallback={(document, options) => {
          options.form.props.closeModal()
          createChannel({
            data: {
              planetId: document._id,
              name: "general"
            }
          })
          createPlanetMember({
            data: { planetId: document._id }
          })
        }}
      />
    </Components.ModalTrigger>
  </div>
);

const optionsMember = {
  collectionName: 'PlanetMembers'
}

const optionsChannel = {
  collectionName: 'Channels'
}

registerComponent({ name: 'NewPlanet', component: NewPlanet, hocs: [withCurrentUser, [withCreate, optionsMember], [withCreate, optionsChannel]] });