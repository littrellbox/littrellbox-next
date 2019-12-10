import React from 'react'
import { registerComponent, withCreate, withCurrentUser} from 'meteor/vulcan:core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '../../lib/Tooltip'

class FeaturedPlanetButton extends React.Component {
  constructor(props) {
    super(props)
  }

  joinPlanet() {
    this.props.createPlanetMember({
      data: {
        planetId: this.props.planet._id
      }
    })
  }
  
  render() {
    return(
      <div className="featured-planet-button">
        <div className="featured-planet-text" onClick={() => this.joinPlanet()}>{this.props.planet.name} <Tooltip text="Featured Server"><FontAwesomeIcon icon={faStar}/></Tooltip></div>
      </div>
    )
  }
}

const options = {
  collectionName: 'PlanetMembers'
};

registerComponent({ name: 'FeaturedPlanetButton', component: FeaturedPlanetButton, hocs: [withCurrentUser, [withCreate, options]]});