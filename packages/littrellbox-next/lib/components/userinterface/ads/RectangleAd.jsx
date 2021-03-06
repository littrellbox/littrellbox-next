import React from 'react'
import { getSetting, registerComponent, withCurrentUser } from 'meteor/vulcan:core'

class RectangleAd extends React.Component {
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    if(window && getSetting("adsense.client")) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
  
  render() {
    return(
      <div className="ad-rectangle">
        {getSetting("adsense.client") && <div className="ad-rectangle-ad">
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
        </div>}
      </div>
    )
  }
}

registerComponent({ name: 'RectangleAd', component: RectangleAd, hocs: [withCurrentUser]});