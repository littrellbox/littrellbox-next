import React from 'react';

import { Components, withCurrentUser, registerComponent, withMulti, withCreate } from 'meteor/vulcan:core';

import CircleLoader from '../../../lib/Loader'

class DMList extends React.Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(this.props.results !== nextProps.results)
      return true;
    return this.props.currentUser !== nextProps.currentUser;
  }

  getUserId(channel) {
    if (channel.dmUserIds.length !== 2) {
      return [""]
    }
    let arrayInPlace = [...channel.dmUserIds];
    arrayInPlace.splice(channel.dmUserIds.indexOf(this.props.currentUser._id), 1);
    return arrayInPlace
  }

  render() {
    return (
      <div className="channel-list">
        <div className="dm-list-title">
          <div className="channel-list-title-text">
            DIRECT MESSAGES
          </div>
        </div>
        {!this.props.results ?
          <div className="channel-list-loader">
            <CircleLoader/>
          </div>:
          <div className="channel-list-container">
            {this.props.results.map(channel => <Components.DMButton
              key={channel._id} 
              buttonChannel={channel}
              documentId={this.getUserId(channel)[0]}
              terms={{
                view: 'byChannelId',
                channelId: channel._id
              }}
            />)}
          </div>
        }
      </div>
    )
  }
}

const options = {
  collectionName: "Channels",
  queryOptions: { pollInterval: 5000 }
};

registerComponent({ name: 'DMList', component: DMList, hocs: [withCurrentUser, [withMulti, options], [withCreate, options]] });