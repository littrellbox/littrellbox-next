import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withMulti, withSingle } from 'meteor/vulcan:core';

class Invite extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="invite">
        {!this.props.loading && <div>
            <Components.InviteBox
              terms={{
                view: 'userLookup',
                userId: this.props.currentUser._id,
                planetId: this.props.document.planetId
              }}
              documentId={this.props.document.planetId}
            />
            <span className="debug-text">{"Invite ID: " + this.props.document._id}</span>
          </div>
        }
      </div>
    )
  }
}

const options = {
  collectionName: 'Invites' 
}

registerComponent({ name: 'Invite', component: Invite, hocs: [withCurrentUser, [withSingle, options] ] });