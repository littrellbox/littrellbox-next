import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';
//import context

class InviteMain extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    inviteArray = this.props.location.pathname.split("/")
    return (
      <div className="main"> 
        <Helmet>
          <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"/> 
        </Helmet>
        {this.props.currentUser && <div className="invite">
          {inviteArray[inviteArray.length - 1]}
        </div> }
        {!this.props.currentUser && <div style={{ maxWidth: "500px", margin: "20px auto" }}>
          <div className="login-form">
            <div>
              <Components.AccountsLoginForm redirect={false} />
            </div>
          </div>
        </div> }
      </div>
    )
  }
}

registerComponent({ name: 'InviteMain', component: InviteMain, hocs: [withCurrentUser] });