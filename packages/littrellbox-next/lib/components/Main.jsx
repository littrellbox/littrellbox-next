import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

//import UI elements
import './userinterface/sidebars/PlanetSidebar'
import './userinterface/sidebars/ChannelSidebar'
import './userinterface/MessageArea'

const Main = ({ currentUser }) => (
  <div> 
    {currentUser && <div className="main-app">
      <Components.PlanetSidebar terms={{
        view: 'byUserId',
        userId: currentUser._id
      }} />
      <Components.ChannelSidebar/>
      <Components.MessageArea/>
    </div> }
    {!currentUser && <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <div className="login-form">
        <div>
          <Components.AccountsLoginForm redirect={false} />
        </div>
      </div>
    </div> }
  </div>
);

registerComponent({ name: 'Main', component: Main, hocs: [withCurrentUser] });