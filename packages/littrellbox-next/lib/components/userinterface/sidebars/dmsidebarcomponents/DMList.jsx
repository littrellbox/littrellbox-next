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

  getUserId(channel) {
    if (channel.dmUserIds.length != 2) {
      return [""]
    }
    arrayInPlace = [...channel.dmUserIds]
    arrayInPlace.splice(channel.dmUserIds.indexOf(this.props.currentUser._id), 1)
    return arrayInPlace
  }

  render() {
    return (
      <div className="channel-list">
        <div className="channel-list-title">
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