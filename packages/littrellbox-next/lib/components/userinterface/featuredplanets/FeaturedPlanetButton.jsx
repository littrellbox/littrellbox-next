import React from 'react'
import {Components, registerComponent, withCreate, withCurrentUser} from 'meteor/vulcan:core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

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
        <div className="featured-planet-text" onClick={() => this.joinPlanet()}>{this.props.planet.name} <FontAwesomeIcon icon={faCheckCircle}/></div>
      </div>
    )
  }
}

const options = {
  collectionName: 'PlanetMembers'
}

registerComponent({ name: 'FeaturedPlanetButton', component: FeaturedPlanetButton, hocs: [withCurrentUser, [withCreate, options]]});