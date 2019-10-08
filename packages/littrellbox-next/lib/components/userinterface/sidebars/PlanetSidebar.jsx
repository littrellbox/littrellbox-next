import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './planetcomponents/PlanetButton'
import './planetcomponents/NewPlanet'

const PlanetSidebar = ({results = [], currentUser, loading, loadMore, count, totalCount }) => (
  <div className="planet-sidebar">
    {loading ?
      <Loading/>:
      <div> 
        {results.map(planet => <Components.PlanetButton key={planet._id}>{planet.name}</Components.PlanetButton>)}
      </div>
    }
    
    <Components.NewPlanet/>
  </div>
);

const options = {
  collectionName: "Planets"
};

registerComponent({ name: 'PlanetSidebar', component: PlanetSidebar, hocs: [withCurrentUser, [withMulti, options]] });
