import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

import './ChannelButton'

const ChannelList = ({planet, currentUser, results = [], loading, terms}) => {
  return (
    <div className="channel-list">
      <div className="channel-list-title">
        CHANNELS
        <Components.ModalTrigger size="large" title="New Planet" component={<div className="new-channel-button">+</div>}>
          <Components.SmartForm
            collectionName="Channels"
            fields={['name']}
            prefilledProps={{
              planetId: planet._id
            }}
            successCallback={(document, options) => {
              options.form.props.closeModal()
            }}
          />
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