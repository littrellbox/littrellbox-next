import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti, withCreate } from 'meteor/vulcan:core';

import CircleLoader from '../../../lib/Loader'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class DMList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="channel-list">
        <div className="channel-list-title">
          <div className="channel-list-title-text">
            DIRECT MESSAGES
          </div>
        </div>
        {this.props.loading ?
          <div className="channel-list-loader">
            <CircleLoader/>
          </div>:
          <div className="channel-list-container">
            {this.props.results.map(channel => <Components.ChannelButton key={channel._id} buttonChannel={channel} terms={{
              view: 'byChannelId',
              channelId: channel._id
            }}/>)}
          </div>
        }
      </div>
    )
  }
}

const options = {
  collectionName: "Channels",
  queryOptions: { pollInterval: 200 }
};

registerComponent({ name: 'DMList', component: DMList, hocs: [withCurrentUser, [withMulti, options], [withCreate, options]] });