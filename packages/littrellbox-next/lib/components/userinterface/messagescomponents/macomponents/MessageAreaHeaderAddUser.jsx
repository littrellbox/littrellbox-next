import React from 'react'
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

class MessageAreaHeaderAddUser extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: ""
    }
  }

  setUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  render() {
    return (
      <div className="message-area-header-add-user">
        <div className="mah-add-user-textbox-div">
          <Components.UserFinder terms={{
            view: 'byUsername',
            username: this.state.username,
            limit: 1
          }}/>
          <input type="text" value={this.state.username} className="mah-add-user-textbox" onChange={(e) => this.setUsername(e)}/>
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'MessageAreaHeaderAddUser', component: MessageAreaHeaderAddUser, hocs: [withCurrentUser]});