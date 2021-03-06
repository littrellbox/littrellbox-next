import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';
//import context

class InviteMain extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let inviteArray = this.props.location.pathname.split("/");
    return (
      <div className="main"> 
        <Helmet>
          <link href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap" rel="stylesheet"/> 
        </Helmet>
        {this.props.currentUser && <Components.Invite documentId={inviteArray[inviteArray.length - 1]}/> }
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