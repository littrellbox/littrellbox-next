import React from 'react'
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate } from 'meteor/vulcan:core';

class MessageAreaHeaderAddUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ""
    }
  }

  // ! workaround for VulcanJS/Vulcan#2449
  ourUserId = null;

  setUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.addUser()
    }
  }

  updateId(id) {
    this.ourUserId = id
  }

  addUser() {
    if(this.ourUserId) {
      let arrayOfIds = [...this.props.channel.dmUserIds];
      arrayOfIds.push(this.ourUserId);
      if(this.props.channel.dmUserIds.length > 2) {
        let documentId = this.props.channel._id;
        this.props.updateChannel({
          selector: { documentId },
          data: {
            dmUserIds: arrayOfIds
          }
        })
      } else {
        this.props.createChannel({
          data: {
            isDm: true,
            dmUserIds: arrayOfIds,
            name: "New Group"
          }
        })
      }
      this.props.toggleAddUser()
    }
  }

  render() {
    return (
      <div className="message-area-header-add-user" style={this.props.style}>
        <div className="mah-add-user-textbox-div">
          <Components.UserFinder updateId={(id) => this.updateId(id)} terms={{
            view: 'byUsername',
            username: this.state.username,
            limit: 1
          }}/>
          <input type="text" value={this.state.username} className="mah-add-user-textbox" onKeyPress={(e) => this.handleKeyPress(e)} onChange={(e) => this.setUsername(e)}/>
        </div>
      </div>
    )
  }
}

const channelOptions = {
  collectionName: "Channels"
};

registerComponent({ name: 'MessageAreaHeaderAddUser', component: MessageAreaHeaderAddUser, hocs: [withCurrentUser, [withCreate, channelOptions], [withUpdate, channelOptions]]});