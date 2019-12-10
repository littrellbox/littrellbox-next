import React from 'react';
import {withCurrentUser, registerComponent, withMulti, withSingle, withCreate } from 'meteor/vulcan:core';
//import context

class InviteBox extends React.Component {
  constructor(props) {
    super(props);
  }

  goHome() {
    window.location = window.location.origin;
  }

  joinPlanet() {
    this.props.createPlanetMember({
      data: {
        planetId: this.props.document._id
      }
    })
  }

  render() {
    return (
      <div className="invite-box">
        {!this.props.loading && this.props.results.length === 0 && <div>
          <span>You've been invited to</span>
          <div className="invite-planet-name">{this.props.document.name}</div>
          <div className="invite-button" onClick={() => this.joinPlanet()}>Join {this.props.document.name}</div>
        </div> }
        {!this.props.loading && this.props.results.length !== 0 && <div>
          You're already in {this.props.document.name}!
          <div className="invite-button" onClick={() => this.goHome()}>Return to Littrellbox</div>
        </div>}
      </div>
    )
  }
}

const options = {
  collectionName: 'PlanetMembers'
};

const optionsSingle = {
  collectionName: 'Planets' 
};

registerComponent({ name: 'InviteBox', component: InviteBox, hocs: [withCurrentUser, [withMulti, options], [withSingle, optionsSingle], [withCreate, options] ] });