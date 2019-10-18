import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti, withCreate } from 'meteor/vulcan:core';

import './ChannelButton'
import './NewChannelForm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class ChannelList extends React.Component {
  constructor(props) {
    super(props)

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
    if(e.key == "Enter") {
      this.props.createChannel({
        data: {
          planetId: this.props.planet._id,
          name: this.state.textboxText
        }
      })
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
          {this.props.currentUser._id == this.props.planet.userId && <div>
            <span className="new-channel-button" onClick={() => this.toggleTextbox()}><FontAwesomeIcon icon={faPlus}/></span>
          </div>}

          {//currentUser._id == planet.userId && <Components.ModalTrigger size="large" title="New Planet" className="new-channel-trigger" component={<span className="new-channel-button"><FontAwesomeIcon icon={faPlus}/></span>}>
            //<Components.NewChannelForm/>
          //</Components.ModalTrigger> 
          }
        </div>
        {this.state.showNewChannelTextbox && <input 
          type="text" 
          className="new-channel-textbox"
          onChange={(e) => this.handleChange(e)}
          onKeyPress={(e) => this.handleKeyPress(e)}
        />}
        {this.props.loading ?
          <div>Loading</div>:
          <div>
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
  collectionName: "Channels"
};

registerComponent({ name: 'ChannelList', component: ChannelList, hocs: [withCurrentUser, [withMulti, options], [withCreate, options]] });