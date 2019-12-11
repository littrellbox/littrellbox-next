import React from 'react'
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faUserShield } from '@fortawesome/free-solid-svg-icons'

import { Hidden, Visible, HiddenWithMoveUp } from '../../lib/AnimationStyles'

import Tooltip from '../../lib/Tooltip'

class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showProfile: false,
      showBlockedMessages: false
    }
  }

  shouldComponentUpdate(newProps, newState) {
    if(this.state !== newState)
      return true;
    if(this.props.messages !== newProps.messages) 
      return true;
    if(typeof(this.props.document) !== typeof(newProps.document))
      return true;
    if(typeof(this.props.channel) !== typeof(newProps.channel))
      return true;
    if(newProps.document && this.props.document && this.props.document.username !== newProps.document.username)
      return true;
    if(newProps.document && this.props.document && this.props.document.lb_profilePicture !== newProps.document.lb_profilePicture)
      return true;
    return !!(newProps.channel && this.props.channel && this.props.channel._id !== newProps.channel._id);

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

  toggleBlocked() {
    this.setState({
      showBlockedMessages: !this.state.showBlockedMessages
    })
  }

  render() {
    let document = this.props.document;
    if(!this.props.document) {
      document = {
        username: "Unknown User"
      }
    }
    if(this.props.document && (!this.props.document.username || this.props.document.username === "")) {
      document = {
        username: "Deleted User"
      }
    }

    let date = new Date(this.props.messages[0].createdAt);

    let timeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric'};
    
    if(this.props.document && !this.state.showBlockedMessages && this.props.currentUser.lb_usersBlocked && this.props.currentUser.lb_usersBlocked.includes(this.props.document._id)) {
      return (
        <div className="btn" onClick={() => this.toggleBlocked()}>
          Show blocked messages from {this.props.document.username}
        </div>
      )
    }

    return (
     <div className="message-container message">
       <div>
         <Components.ProfileModal user={this.props.document} style={this.state.showProfile ? Visible : HiddenWithMoveUp}/>
         <div className="dialog-semi-transparent-background" style={this.state.showProfile ? Visible : Hidden} onClick={() => this.toggleProfile()}/>
       </div>
       {this.props.document && !this.props.document.lb_profilePicture && <div className="message-profile-picture" onClick={() => this.toggleProfile()}/>}
       {this.props.document && this.props.document.lb_profilePicture && <div className="message-profile-picture" onClick={() => this.toggleProfile()}>
         <img src={this.props.document.lb_profilePicture} className="message-pfp-image" alt="Profile Picture"/>
       </div>}
       <div style={{width: "100%"}}>
         <div className="message-header">
           <div className="message-userdate">
             <span className="message-username" onClick={() => this.toggleProfile()}>{document.username} </span>
             {this.props.document && this.props.document.isAdmin && <Tooltip text="Moderator" className="message-name-icon"><FontAwesomeIcon icon={faUserShield}/></Tooltip>}
             {this.props.document && (this.props.document._id === this.props.planet.userId) && <Tooltip text="Planet Owner" className="message-name-icon"><FontAwesomeIcon icon={faCrown}/></Tooltip>}
             <span className="message-date">
                - {date.toLocaleDateString(navigator.language, timeOptions)}
             </span> 
            {this.props.document && this.props.currentUser.lb_usersBlocked && this.props.currentUser.lb_usersBlocked.includes(this.props.document._id) && <span onClick={() => this.toggleBlocked()}> Hide Messages</span>}
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
