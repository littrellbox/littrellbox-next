import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';
//import context
import {ChatContext} from '../contexts/ChatContext'

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ChatContext.Provider value={this.state} className="main"> 
        <Helmet>
          <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"/> 
        </Helmet>
        {this.props.currentUser && <div className="invite">

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