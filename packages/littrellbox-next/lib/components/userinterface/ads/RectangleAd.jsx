import React from 'react'
import { getSetting, Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAd } from '@fortawesome/free-solid-svg-icons'

class RectangleAd extends React.Component {
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
  
  componentDidMount() {
    if(window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
  
  render() {
    console.log(Meteor.isProduction)


    return(
      <div className="ad-rectangle">
        <div className="ad-rectangle-ad">
          {Meteor.isProduction ? 
            <ins 
              data-ad-format="fluid"
              data-ad-layout-key="-6t+ed+2i-1n-4w"
              className="adsbygoogle infeed"
              data-ad-client={getSetting("adsense.client")}
              data-ad-slot={getSetting("adsense.rectangleSlot")}
            /> :
            <ins 
              className="adsbygoogle infeed"
              data-ad-format="fluid"
              data-ad-layout-key="-6t+ed+2i-1n-4w"
              data-ad-client={getSetting("adsense.client")}
              data-ad-slot={getSetting("adsense.rectangleSlot")}
              data-ad-test="on"
            />
          }
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'RectangleAd', component: RectangleAd, hocs: [withCurrentUser]});