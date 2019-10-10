import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

//import UI elements
import './userinterface/sidebars/PlanetSidebar'
import './userinterface/sidebars/ChannelSidebar'
import './userinterface/MessageArea'

//import context
import {ChatContext} from '../contexts/ChatContext'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.switchPlanet = (planetToSet) => {
      this.setState(state => ({
        planet: planetToSet
      }));
    };

    this.switchChannel = (channelToSet) => {
      this.setState(state => ({
        channel: channelToSet
      }));
    };

    this.state = {
      planet: {},
      channel: {},
      switchPlanet: this.switchPlanet,
      switchChannel: this.switchChannel
    };
  }

  render() {
    return (
      <ChatContext.Provider value={this.state} className="main"> 
        <Helmet>
          <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"/> 
        </Helmet>
        {this.props.currentUser && <div className="main-app">
          <Components.PlanetSidebar terms={{
            view: 'byUserId',
            userId: this.props.currentUser._id
          }} />
          <Components.ChannelSidebar/>
          <Components.MessageArea/>
        </div> }
        {!this.props.currentUser && <div style={{ maxWidth: "500px", margin: "20px auto" }}>
          <div className="login-form">
            <div>
              <Components.AccountsLoginForm redirect={false} />
            </div>
          </div>
        </div> }
      </ChatContext.Provider>
    )
  }
}

registerComponent({ name: 'Main', component: Main, hocs: [withCurrentUser] });