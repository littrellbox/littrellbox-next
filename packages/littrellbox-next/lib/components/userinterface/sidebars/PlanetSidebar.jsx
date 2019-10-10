import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './planetcomponents/PlanetButton'
import './planetcomponents/NewPlanet'

const PlanetSidebar = ({results = [], currentUser, loading, loadMore, count, totalCount, terms }) => (
  <div className="scroll-container">
    <div className="planet-sidebar">
      {loading ?
        <Loading/>:
        <div> 
          {results.map(planetmember => <Components.PlanetButton terms={terms} key={planetmember._id} documentId={planetmember.planetId}/>)}
        </div>
      }
        <Components.NewPlanet/>
    </div>
  </div>
);

const options = {
  collectionName: "PlanetMembers"
};

registerComponent({ name: 'PlanetSidebar', component: PlanetSidebar, hocs: [withCurrentUser, [withMulti, options]] });
