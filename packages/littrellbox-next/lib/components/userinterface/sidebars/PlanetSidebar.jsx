import React from 'react';

import { Components, withCurrentUser, registerComponent, withMulti } from 'meteor/vulcan:core';

import { ChatContext } from '../../../contexts/ChatContext'

class PlanetSidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  ReactStupidInfiniteLoopPreventionBoolean = false;

  componentDidUpdate() {
    if(this.props.results && !this.props.loading && this.context.planet && this.context.planet !== {}) {
      if(this.props.results.filter(value => value.planetId === this.context.planet._id).length === 0 && !this.ReactStupidInfiniteLoopPreventionBoolean) {
        //the planet doesn't exist, or we aren't in it (this is checked in the server)
        this.context.clearPlanet();
        this.ReactStupidInfiniteLoopPreventionBoolean = true
      } else {
        this.ReactStupidInfiniteLoopPreventionBoolean = false
      }
    } else {
      this.ReactStupidInfiniteLoopPreventionBoolean = false
    }
  }

  render() {
    return (
      <div className="scroll-container">
        {this.props.results && <div className="planet-sidebar">
          { this.props.loading ?
            <div/>:
            <div> 
              <Components.HomeButton/>
              {this.props.results.map(planetmember => <Components.PlanetButton
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
    )
  }
}

PlanetSidebar.contextType = ChatContext;

const options = {
  collectionName: "PlanetMembers",
  queryOptions: { pollInterval: 1000 } //this needs to update quickly for A: notifications B: deletions
};

registerComponent({ name: 'PlanetSidebar', component: PlanetSidebar, hocs: [withCurrentUser, [withMulti, options]] });
