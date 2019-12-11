import React from 'react';
import { withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUsers} from '@fortawesome/free-solid-svg-icons'

class DMButton extends React.Component {
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

          if(channel._id === this.props.buttonChannel._id) {
            return(
              <div className="channel-button-active dm-button">
                <span className="dm-button-profile-picture">
                  {this.props.documentId === "" && <FontAwesomeIcon className="dm-button-group-icon" icon={faUsers}/>}
                  {this.props.documentId !== "" && this.props.document && this.props.document.lb_profilePicture && <img src={this.props.document.lb_profilePicture} alt="" className="dm-button-pfp-image"/>}
                </span>
                {this.props.documentId !== "" && this.props.document && <span className="channel-button-active-text dmb-text">{this.props.document.username}</span>}
                {this.props.documentId === "" && <span className="channel-button-active-text dmb-text">{this.props.buttonChannel.name}</span>}
              </div>
            )
          }

          return(
            <div className="channel-button dm-button flex" onClick={() => switchChannel(this.props.buttonChannel)}>
              <span className="dm-button-profile-picture">
                {this.props.documentId === "" && <FontAwesomeIcon className="dm-button-group-icon" icon={faUsers}/>}
                {this.props.documentId !== "" && this.props.document && this.props.document.lb_profilePicture && <img src={this.props.document.lb_profilePicture} alt="" className="dm-button-pfp-image"/>}
              </span>
              {this.props.documentId !== "" && this.props.document && <span className="channel-button-active-text dmb-text">{this.props.document.username}</span>}
              {this.props.documentId === "" && <span className="channel-button-active-text dmb-text">{this.props.buttonChannel.name}</span>}
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'DMButton', component: DMButton, hocs: [withCurrentUser, [withSingle, options]] });