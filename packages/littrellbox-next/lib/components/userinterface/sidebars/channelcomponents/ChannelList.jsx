import React from 'react';

import { Components, withCurrentUser, registerComponent, withMulti, withCreate } from 'meteor/vulcan:core';

import CircleLoader from '../../../lib/Loader'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Visible, HiddenNoHeight } from '../../../lib/AnimationStyles';

class ChannelList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewChannelTextbox: false,
      textboxText: ""
    }
  }

  toggleTextbox() {
    this.setState({
      showNewChannelTextbox: !this.state.showNewChannelTextbox
    })
  }

  handleKeyPress(e) {
    if(e.key === "Enter") {
      this.props.createChannel({
        data: {
          planetId: this.props.planet._id,
          name: this.state.textboxText
        }
      });
      this.setState({
        showNewChannelTextbox: false
      })
    }
  }

  handleChange(e) {
    this.setState({
      textboxText: e.target.value
    })
  }

  render() {
    return (
      <div className="channel-list">
        <div className="channel-list-title">
          <div className="channel-list-title-text">
            CHANNELS
          </div>
          {this.props.currentUser._id === this.props.planet.userId && <div>
            <span className="new-channel-button" onClick={() => this.toggleTextbox()}><FontAwesomeIcon icon={faPlus}/></span>
          </div>}
        </div>
        <input 
          type="text" 
          className="new-channel-textbox"
          onChange={(e) => this.handleChange(e)}
          onKeyPress={(e) => this.handleKeyPress(e)}
          style={this.state.showNewChannelTextbox ? Visible : HiddenNoHeight}
        />
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
  queryOptions: { pollInterval: 5000 }
};

registerComponent({ name: 'ChannelList', component: ChannelList, hocs: [withCurrentUser, [withMulti, options], [withCreate, options]] });