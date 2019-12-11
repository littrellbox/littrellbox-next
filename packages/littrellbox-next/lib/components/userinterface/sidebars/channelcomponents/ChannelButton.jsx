import React from 'react';
import { withCurrentUser, registerComponent, withCreate, withMulti } from 'meteor/vulcan:core';

import Tooltip from '../../../lib/Tooltip'

import {ChatContext} from '../../../../contexts/ChatContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faHashtag } from '@fortawesome/free-solid-svg-icons'

class ChannelButton extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = React.createRef();

    this.state = {
      inviteDialogShow: false,
      inviteId: "",
      copied: false
    };
  }

  getInvite() {
    if(this.props.loading) {
      return
    }
    if(this.props.results.length !== 0) {
      this.textInput.current.value = window.location + "invite/" + this.props.results[0]._id;
      this.textInput.current.select();
      window.document.execCommand('copy');
      this.setState({
        copied: true
      })
    } else {
      this.props.createInvite({
        data: {
          channelId: this.props.buttonChannel._id,
          planetId: this.props.buttonChannel.planetId
        }
      }).then(function(value) {
        this.textInput.current.value = window.location + "invite/" + value.data.createInvite.data._id;
        this.textInput.current.select();
        window.document.execCommand('copy');
        this.setState({
          copied: true
        })
      })
    }
  }

  toggleDialog() {
    this.setState({
      inviteDialogShow: !this.state.inviteDialogShow
    })
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

          if(channel._id === this.props.buttonChannel._id) {
            return(
              <div className="channel-button-active">
                {this.state.inviteDialogShow && <div className="dialog-transparent-background" onClick={() => this.toggleDialog()}>
                  <div className="dialog">
                    Your invite url is:
                    <div className="invite-dialog-url">
                    <a href={window.location + "invite/" + this.state.inviteId}>{window.location + "invite/" + this.state.inviteId}</a>
                    </div>
                  </div>
                </div>}
                <span className="channel-button-active-text">
                  <FontAwesomeIcon icon={faHashtag}/> {this.props.buttonChannel.name}
                </span>
                <span className="channel-button-active-invite" onMouseLeave={() => {this.setState({copied: false})}}>
                  <input type="text" className="no-size" ref={this.textInput}/>
                  <Tooltip side="left tooltip-left-channel" text={this.state.copied ? "Copied!" : "Click to copy"}><FontAwesomeIcon onClick={() => this.getInvite()} icon={faUserPlus}/></Tooltip>
                </span>
              </div>
            )
          }
          return(
            <div className="channel-button" onClick={() => switchChannel(this.props.buttonChannel)}>
              <FontAwesomeIcon icon={faHashtag}/> {this.props.buttonChannel.name}
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

const options = {
  collectionName: "Invites"
};

registerComponent({ name: 'ChannelButton', component: ChannelButton, hocs: [withCurrentUser, [withCreate, options], [withMulti, options]] });