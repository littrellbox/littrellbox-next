import React from 'react';
import { registerComponent, withMulti, withSingle } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'

import CircleLoader from '../../../lib/Loader'

class PlanetButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.context.planet._id === this.props.document._id && this.context.planet !== this.props.document) {
      this.context.switchPlanet(this.props.document)
    }
    if(this.context.planetMember._id === this.props.member._id && this.context.planetMember !== this.props.member) {
      this.context.setPlanetMember(this.props.member)
    }
  }

  checkNotifications(channel) {
    if(this.props.document && this.props.document.lastMessagesArray && this.props.member.lastVisitedArray) {
      let array = JSON.parse(this.props.document.lastMessagesArray);
      let lastVisited = JSON.parse(this.props.member.lastVisitedArray);
      let newNotif = false;
      for (const value of Object.entries(array)) {
        let dateMessages = Date.parse(value[1].toString());
        let dateVisited = Date.parse(lastVisited[value[0]]);
        if(!channel || !channel._id || value[0] !== channel._id && !newNotif)
          newNotif = dateMessages > dateVisited;
      }
      return newNotif;
    }
    return false;
  }

  render() {
    if(!this.props.document) {
      return (
        <div className="planet-button">
          <div className="planet-button-inner">
            ?
          </div>
        </div>
      )
    }

    let text = "";
    if(this.props.document) {
      let textsplit = this.props.document.name.split(" ");
      textsplit.forEach(element => {
        text = text + element.substring(0,1)
      });
    }

    return (
      <ChatContext.Consumer>
        {({switchPlanet, switchChannel, setPlanetMember, channel}) => (
          <div
            className="planet-button"
            onClick={() => {
              switchChannel(this.props.results[0]);
              switchPlanet(this.props.document);
              setPlanetMember(this.props.member)
            }}
          >
            {this.checkNotifications(channel) && <div className="planet-button-unread"/>}
            {(!document.image && !this.props.loading) ? <div className="planet-button-inner">
              {this.props.loading ?
                <CircleLoader/> :
                <div className="planet-button-text">
                  {text}
                </div>
              }
            </div> : <img alt={text} className="planet-button-image" src={document.image}/>}
          </div>
        )}
      </ChatContext.Consumer>
    )
  }
}

PlanetButton.contextType = ChatContext;

const options = {
  collectionName: "Planets",
  queryOptions: { pollInterval: 1000 }
};

const optionsMulti = {
  collectionName: "Channels"
};

registerComponent({ name: 'PlanetButton', component: PlanetButton, hocs: [[withSingle, options], [withMulti, optionsMulti]] });
