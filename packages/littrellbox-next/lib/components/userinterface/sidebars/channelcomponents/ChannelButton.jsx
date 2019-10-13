import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'

class ChannelButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ChatContext.Consumer>
        {({channel, switchChannel}) => {
          if(!this.props.buttonChannel) {
            this.props.buttonChannel = {
              name: "Loading..."
            }
          }
          if(channel == this.props.buttonChannel) {
            return(
              <div className="channel-button-active" onClick={() => switchChannel(this.propsbuttonChannel)}>
                #{this.props.buttonChannel.name}
              </div>
            )
          }
          return(
            <div className="channel-button" onClick={() => switchChannel(this.props.buttonChannel)}>
              #{this.props.buttonChannel.name}
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

registerComponent({ name: 'ChannelButton', component: ChannelButton, hocs: [withCurrentUser] });