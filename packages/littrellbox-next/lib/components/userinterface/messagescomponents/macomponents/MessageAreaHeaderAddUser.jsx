import React from 'react'
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

class MessageAreaHeaderAddUser extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="message-area-header-add-user">
        <div className="mah-add-user-textbox-div">
          <Components.UserFinder terms={{
            view: 'byUsername',
            username: this.props.username,
            limit: 1
          }}/>
          <input type="text" className="mah-add-user-textbox"/>
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'MessageAreaHeaderAddUser', component: MessageAreaHeaderAddUser, hocs: [withCurrentUser]});