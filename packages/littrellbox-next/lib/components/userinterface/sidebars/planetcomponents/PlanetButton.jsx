import React from 'react';
import { registerComponent, withMulti, withSingle } from 'meteor/vulcan:core';

import {ChatContext} from '../../../../contexts/ChatContext'

import CircleLoader from '../../../lib/Loader'

class PlanetButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.document && this.context.planet) {
      if(this.context.planet._id === this.props.document._id && this.context.planet !== this.props.document) {
        this.context.switchPlanet(this.props.document)
      }
      if(this.context.planetMember._id === this.props.member._id && this.context.planetMember !== this.props.member) {
        this.context.setPlanetMember(this.props.member)
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(this.props.document !== nextProps.document)
      return true;
    if(this.props.member !== nextProps.member)
      return true;
    if(this.props.results !== nextProps.results)
      return true;
    if(this.context.planetMember !== nextContext.planetMember)
      return true;
    return this.props.loading !== nextProps.loading;
  }

  checkNotifications(channel) {
    if(this.props.document && this.props.document.lastMessagesArray && this.props.member.lastVisitedArray) {
      let array = JSON.parse(this.props.document.lastMessagesArray);
      let lastVisited = JSON.parse(this.props.member.lastVisitedArray);
      let newNotif = false;
      for (const value of Object.entries(array)) {
        if ((!lastVisited || !lastVisited[value[0]]) && array) {
          //we've never visited the channel before
          newNotif = true;
          this.context.updateNotification(value[0]._id, true);
        }
        let dateMessages = Date.parse(value[1].toString());
        let dateVisited = Date.parse(lastVisited[value[0]]);
        if(!channel || !channel._id || value[0] !== channel._id && !newNotif) {
          newNotif = dateMessages > dateVisited;
          this.context.updateNotification(value[0]._id, dateMessages > dateVisited);
        }
      }
      return newNotif;
    }
    this.context.updateNotification("", false);
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

    let notificationsStyle = 'planet-button-unread';

    if(this.props.member && this.props.member.pingArray) {
      if(Object.values(JSON.parse(this.props.member.pingArray)).includes(true))
        notificationsStyle = "planet-button-unread planet-button-ping"
    }

    return (
      <ChatContext.Consumer>
        {({switchPlanet, switchChannel, setPlanetMember, channel}) => (
          <div style={{position: "relative"}}>
            {this.props.document._id === this.context.planet._id && <div className="planet-button-current"/>}
            <div
              className="planet-button"
              onClick={() => {
                switchChannel(this.props.results[0]);
                switchPlanet(this.props.document);
                setPlanetMember(this.props.member)
              }}
            >
              {this.checkNotifications(channel) && <div className={notificationsStyle}/>}
              {(!this.props.document.image && !this.props.loading) ? <div className="planet-button-inner">
                {this.props.loading ?
                  <CircleLoader/> :
                  <div className="planet-button-text">
                    {text}
                  </div>
                }
              </div> : <img alt={text} className="planet-button-image" src={this.props.document.image}/>}
            </div>
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
