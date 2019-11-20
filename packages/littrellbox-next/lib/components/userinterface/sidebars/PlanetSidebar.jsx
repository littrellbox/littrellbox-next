import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

const PlanetSidebar = ({results = [], currentUser, loading, loadMore, count, totalCount, terms }) => (
  <div className="scroll-container">
    {results && <div className="planet-sidebar">
      { loading ?
        <Loading/>:
        <div> 
          <Components.HomeButton/>
          {results.map(planetmember => <Components.PlanetButton
            key={planetmember._id} 
            documentId={planetmember.planetId} 
            member={planetmember}
            terms={{
              view: 'byPlanetId',
              planetId: planetmember.planetId,
              limit: 1
            }}
          />)}
        </div>
      }
        <Components.NewPlanet/>
    </div>}
  </div>
);

const options = {
  collectionName: "PlanetMembers"
};

registerComponent({ name: 'PlanetSidebar', component: PlanetSidebar, hocs: [withCurrentUser, [withMulti, options]] });
