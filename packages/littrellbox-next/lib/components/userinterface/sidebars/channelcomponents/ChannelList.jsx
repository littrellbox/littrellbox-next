import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './ChannelButton'
import './NewChannelForm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const ChannelList = ({planet, currentUser, results = [], loading, terms}) => {
  return (
    <div className="channel-list">
      <div className="channel-list-title">
        <div className="channel-list-title-text">
          CHANNELS
        </div>
        {currentUser._id == planet.userId && <Components.ModalTrigger size="large" title="New Planet" className="new-channel-trigger" component={<span className="new-channel-button"><FontAwesomeIcon icon={faPlus}/></span>}>
          <Components.NewChannelForm/>
        </Components.ModalTrigger> }
      </div>
      {loading ?
        <div>Loading</div>:
        <div>
          {results.map(channel => <Components.ChannelButton key={channel._id} buttonChannel={channel} terms={{
            view: 'byChannelId',
            channelId: channel._id
          }}/>)}
        </div>
      }
    </div>
  )
}

const options = {
  collectionName: "Channels"
};

registerComponent({ name: 'ChannelList', component: ChannelList, hocs: [withCurrentUser, [withMulti, options]] });