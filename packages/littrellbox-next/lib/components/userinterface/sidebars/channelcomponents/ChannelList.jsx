import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './ChannelButton'
import './NewChannelForm'

const ChannelList = ({planet, currentUser, results = [], loading, terms}) => {
  return (
    <div className="channel-list">
      <div className="channel-list-title">
        <div className="channel-list-title-text">
          CHANNELS
        </div>
        <Components.ModalTrigger size="large" title="New Planet" className="new-channel-trigger" component={<span className="new-channel-button">+</span>}>
          <Components.NewChannelForm/>
        </Components.ModalTrigger>
      </div>
      {loading ?
        <div>Loading</div>:
        <div>
          {results.map(channel => <Components.ChannelButton key={channel._id} buttonChannel={channel}/>)}
        </div>
      }
    </div>
  )
}

const options = {
  collectionName: "Channels"
};

registerComponent({ name: 'ChannelList', component: ChannelList, hocs: [withCurrentUser, [withMulti, options]] });