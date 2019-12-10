import React from 'react'
import {Components, registerComponent, withMulti, withCurrentUser} from 'meteor/vulcan:core'

class FeaturedPlanets extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return(
      <div className="featured-planets">
        <div className="featured-planets-header">Featured Planets</div>
        {this.props.results && this.props.results.map(planet => <Components.FeaturedPlanetButton
          key={planet._id}
          planet={planet}
        />)}
      </div>
    )
  }
}

const options = {
  collectionName: "Planets"
};

registerComponent({ name: 'FeaturedPlanets', component: FeaturedPlanets, hocs: [withCurrentUser, [withMulti, options]]});