import React from 'react'
import { withCurrentUser, registerComponent, withCreate, withMulti } from 'meteor/vulcan:core';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComments} from '@fortawesome/free-solid-svg-icons'

import {ChatContext} from '../../../../contexts/ChatContext'

import Tooltip from '../../../lib/Tooltip.jsx'

class CreateDMButton extends React.Component {
  constructor(props) {
    super(props)
  }

  createDM(switchChannel, switchPlanet) {
    if(this.props.results && this.props.results.length > 0) {
      switchPlanet({});
      switchChannel(this.props.results[0])
    }
    let createdChannelPromise = this.props.createChannel({
      data: {
        name: "directm",
        isDm: true,
        dmUserIds: [this.props.currentUser._id, this.props.user._id]
      }
    });
    createdChannelPromise.then((value) => {
      switchPlanet({});
      switchChannel(value.data.createChannel.data)
    }).log(e + "a")
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({switchPlanet, switchChannel}) => {
          return(
            <div className="profile-button-dm" onClick={() => this.createDM((channel) => switchChannel(channel), (planet) => switchPlanet(planet))}>
              <Tooltip text="Direct Message">
                <FontAwesomeIcon icon={faComments}/>
              </Tooltip>
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

const options = {
  collectionName: "Channels"
};

registerComponent({ name: 'CreateDMButton', component: CreateDMButton, hocs: [withCurrentUser, [withCreate, options], [withMulti, options]] });
