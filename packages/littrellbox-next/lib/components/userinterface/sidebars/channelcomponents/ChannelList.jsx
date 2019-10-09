import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './ChannelButton'

const ChannelList = ({planet, currentUser, results = [], loading, terms}) => {
  return (
    <div className="channel-list">
      <div className="channel-list-title">
        CHANNELS
      </div>
      {loading ?
        <div>Loading</div>:
        <div>
          {results.map(channel => <Components.ChannelButton key={channel._id} channel={channel}/>)}
        </div>
      }
    </div>
  )
}

const options = {
  collectionName: "Channels"
};

registerComponent({ name: 'ChannelList', component: ChannelList, hocs: [withCurrentUser, [withMulti, options]] });