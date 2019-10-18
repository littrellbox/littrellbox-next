import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate, withMulti } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faHashtag } from '@fortawesome/free-solid-svg-icons'

class ChannelButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inviteDialogShow: false,
      inviteId: ""
    };
  }

  getInvite() {
    if(this.props.loading) {
      return
    }
    if(this.props.results.length != 0) {
      this.setState({
        inviteDialogShow: !this.state.inviteDialogShow,
        inviteId: this.props.results[0]._id
      })
    } else {
      this.props.createInvite({
        data: {
          channelId: this.props.buttonChannel._id,
          planetId: this.props.buttonChannel.planetId
        }
      }).then(function(value) {
        this.setState({
          inviteDialogShow: !this.state.inviteDialogShow,
          inviteId: value.data.createInvite.data._id
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
          if(channel == this.props.buttonChannel) {
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
                  <span className="channel-button-active-invite" onClick={() => this.getInvite()}>
                  <FontAwesomeIcon icon={faUserPlus}/>
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
}

registerComponent({ name: 'ChannelButton', component: ChannelButton, hocs: [withCurrentUser, [withCreate, options], [withMulti, options]] });