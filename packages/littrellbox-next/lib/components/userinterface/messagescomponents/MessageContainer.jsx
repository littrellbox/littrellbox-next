import React from 'react'
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faUserShield } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '../../lib/Tooltip'

class MessageContainer extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      showProfile: false
    }
  }

  shouldComponentUpdate(newProps, newState) {
    if(this.state !==  newState)
      return true;
    if(this.props.messages !== newProps.messages) 
      return true;
    if(this.props.document !== newProps.document)
      return true;
    if(this.props.planet !== newProps.planet)
      return true;
    return false;
  }

  toggleProfile() {
    this.setState({
      showProfile: !this.state.showProfile
    })
  }

  componentDidUpdate() {
    this.props.scrollToBottom()
  }

  componentDidMount() {
    this.props.scrollToBottom()
  }

  render() {
    document = this.props.document
    if(!this.props.document) {
      document = {
        username: "Unknown User"
      }
    }
    if(this.props.document && (!this.props.document.username || this.props.document.username == "")) {
      document = {
        username: "Deleted User"
      }
    }

    var date = new Date(this.props.messages[0].createdAt)

    var timeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric'}
     return (
      <div className="message-container message">
        {this.state.showProfile && <div>
          <Components.ProfileModal user={this.props.document}/>
          <div className="dialog-semi-transparent-background" onClick={() => this.toggleProfile()}/>
        </div>}
        {this.props.document && !this.props.document.lb_profilePicture && <div className="message-profile-picture" onClick={() => this.toggleProfile()}/>}
        {this.props.document && this.props.document.lb_profilePicture && <div className="message-profile-picture" onClick={() => this.toggleProfile()}>
          <img src={this.props.document.lb_profilePicture} className="message-pfp-image"/>
        </div>}
        <div style={{width: "100%"}}>
          <div className="message-header">
            <div className="message-userdate">
              <span className="message-username" onClick={() => this.toggleProfile()}>{document.username} </span>
              {this.props.document && this.props.document.isAdmin && <Tooltip text="Moderator" className="message-name-icon"><FontAwesomeIcon icon={faUserShield}/></Tooltip>}
              {this.props.document && (this.props.document._id == this.props.planet.userId) && <Tooltip text="Planet Owner" className="message-name-icon"><FontAwesomeIcon icon={faCrown}/></Tooltip>}
              <span className="message-date">
                 - {date.toLocaleDateString(navigator.language, timeOptions)}
              </span> 
            </div>
          </div>
          <div className="message-content">
            {this.props.messages.map((message) => <Components.Message 
              key={message._id} 
              message={message} 
              documentId={message.userId}
              scrollToBottom={() => this.props.scrollToBottom()}
              scrollToBottomMessageMount={() => this.props.scrollToBottomMessageMount()}
              forcePositionUpdate={() => this.props.forcePositionUpdate()}
              isScrolled={this.props.isScrolled}
            />)}
          </div>
        </div>
        
      </div>
     )
  }
}

const options = {
  collectionName: "Users"
};

registerComponent({ name: 'MessageContainer', component: MessageContainer, hocs: [withCurrentUser, [withSingle, options]] });