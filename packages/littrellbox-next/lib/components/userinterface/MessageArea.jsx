import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

const MessageArea = ({ currentUser }) => (
  <div className="message-area"> 
    <Components.AccountsLoginForm redirect={false} /> 
  </div>
);

registerComponent({ name: 'MessageArea', component: MessageArea, hocs: [withCurrentUser] });
