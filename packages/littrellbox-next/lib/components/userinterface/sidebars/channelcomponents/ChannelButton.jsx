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

  checkNotifications() {
    if(this.props.buttonChannel && this.context.planet.lastMessagesArray ) {
      let array = JSON.parse(this.context.planet.lastMessagesArray);
      if(!this.context.planetMember.lastVisitedArray && lastVisited[this.props.buttonChannel._id]) {
        //we've never registered visiting a channel
        return true;
      }
      let lastVisited = JSON.parse(this.context.planetMember.lastVisitedArray);
      if(array && array[this.props.buttonChannel._id]) {
        if (!lastVisited || !lastVisited[this.props.buttonChannel._id]) {
          //we've never visited the channel before
          return true
        }
        let dateMessages = Date.parse(array[this.props.buttonChannel._id].toString());
        let dateVisited = Date.parse(lastVisited[this.props.buttonChannel._id]);
        return dateMessages > dateVisited;
      }
    }
    return false;
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

  render() {
    let notificationsStyle = "channel-button-unread";
    if(this.context.planetMember && this.context.planetMember.pingArray) {
      if(Object.values(JSON.parse(this.context.planetMember.pingArray)).includes(true))
        notificationsStyle = "channel-button-unread planet-button-ping"
    }

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
              <FontAwesomeIcon icon={faHashtag}/> {this.props.buttonChannel.name} {this.checkNotifications() && <div className={notificationsStyle}/>}
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

ChannelButton.contextType = ChatContext;

const options = {
  collectionName: "Invites"
};

registerComponent({ name: 'ChannelButton', component: ChannelButton, hocs: [withCurrentUser, [withCreate, options], [withMulti, options]] });