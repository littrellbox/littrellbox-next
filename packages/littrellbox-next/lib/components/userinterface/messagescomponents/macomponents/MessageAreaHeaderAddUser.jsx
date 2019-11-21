import React from 'react'
import { Components, withCurrentUser, registerComponent, withCreate, withUpdate } from 'meteor/vulcan:core';

class MessageAreaHeaderAddUser extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: ""
    }
  }

  ourUserId = null  

  // ! workaround for VulcanJS/Vulcan#2449
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
    ourUserId = id
  }

  addUser() {
    if(ourUserId) {
      arrayOfIds = [...this.props.channel.dmUserIds]
      arrayOfIds.push(ourUserId)
      if(this.props.channel.dmUserIds.length > 2) {
        documentId = this.props.channel.userIds
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
    }
  }

  render() {
    return (
      <div className="message-area-header-add-user">
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
}

registerComponent({ name: 'MessageAreaHeaderAddUser', component: MessageAreaHeaderAddUser, hocs: [withCurrentUser, [withCreate, channelOptions], [withUpdate, channelOptions]]});