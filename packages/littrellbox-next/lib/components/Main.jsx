import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

//import context
import {ChatContext} from '../contexts/ChatContext'

import {faUpload} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.switchPlanet = (planetToSet) => {
      this.setState({
        planet: planetToSet,
        attachments: []
      });
    };

    this.switchChannel = (channelToSet) => {
      if(this.state.channel._id) {
        let documentId = this.state.planetMember._id;
        let arrayToUpdate = this.state.planetMember.lastVisitedArray;
        if(arrayToUpdate === null) {
          arrayToUpdate = [];
        }
        arrayToUpdate[this.state.channel._id] = new Date;
        this.props.updatePlanetMember({
          selector: { documentId },
          data: {
            lastVisitedArray: arrayToUpdate
          }
        });
      }
      this.setState({
        channel: channelToSet,
        attachments: []
      });
    };

    this.onDrop = (acceptedFiles) => {
      let attachments = this.state.attachments;
      Array.from(acceptedFiles).forEach(element => {
        attachments.push(element)
      });
      this.setState({
        attachments: attachments
      })
    };

    this.removeFile = (key) => {
      let attachments = this.state.attachments;
      attachments.splice(key, 1);
      this.setState({
        attachments: attachments
      })
    };

    this.removeAllFiles = () => {
      this.setState({
        attachments: []
      })
    };

    this.clearPlanet = () => {
      this.setState({
        planet: {},
        channel: {},
        planetMember: {}
      })
    };

    this.setPlanetMember = (memberToSet) => {
      this.setState({
        planetMember: memberToSet
      })
    };

    this.state = {
      planet: {},
      channel: {},
      planetMember: {},
      switchPlanet: this.switchPlanet,
      switchChannel: this.switchChannel,
      setPlanetMember: this.setPlanetMember,
      onDrop: this.onDrop,
      removeFile: this.removeFile,
      removeAllFiles: this.removeAllFiles,
      clearPlanet: this.clearPlanet,
      attachments: [],      
      showingDropDialog: false
    };
  }

  //since Component.setState is run synchronously we need to stop it from repeating
  preventInfiniteLoopsWorkaround = false;

  componentDidUpdate() {
    if(!this.preventInfiniteLoopsWorkaround && !this.props.currentUser && (this.state.planet !== {} || this.state.channel !== {})) {
      this.preventInfiniteLoopsWorkaround = true;
      this.setState({
        planet: {},
        channel: {}
      })
    }

    //remove the flag once we login
    if(this.props.currentUser && this.preventInfiniteLoopsWorkaround) {
      this.preventInfiniteLoopsWorkaround = false
    }
  }

  onDragStart(evt) {
    evt.preventDefault();
    if(!this.state.showingDropDialog)
      this.setState({
        showingDropDialog: true
      })
  }

  onDragStop(evt) {
    evt.preventDefault();
    this.setState({
      showingDropDialog: false
    })
  }

  onCCDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({
      showingDropDialog: false
    });

    if(this.props.currentUser.lb_muted !== 1)
      this.onDrop(Array.from(evt.dataTransfer.files))
  }

  render() {
    let channelIdToSet = "";
    if(this.state.channel) {
      channelIdToSet = this.state.channel._id
    }

    let messageLimit = 32;
    if(typeof(window) != 'undefined') {
      if(window.innerHeight > 800)
        messageLimit = 42;
      if(window.innerHeight > 1080)
        messageLimit = 75;
    }

    return (
      <ChatContext.Provider 
        value={this.state} 
        className="main"
      > 
        <Helmet>
          <link href="https://unpkg.com/emoji-mart@2.11.1/css/emoji-mart.css" rel="stylesheet"/> //FIXME: locally store css
        </Helmet>
        
        {this.props.currentUser && <div 
          className="main-app"
          draggable="true"
          onDragOver={(e) => {e.preventDefault()}}
          onDragEnd={(e) => this.onDragStop(e)}
          onDragLeave={(e) => {e.preventDefault()}}
          onDragEnter={(e) => this.onDragStart(e)}
          onDragStart={(e) => {e.preventDefault()}}
          onDragCapture={(e) => {e.preventDefault()}}
          onDrop={(e) => this.onCCDrop(e)}
        >
          {this.state.showingDropDialog && (this.props.currentUser.lb_muted !== 1) && <div className="file-dropzone-upload">
            <div className="file-dropzone-icon"> 
              <FontAwesomeIcon icon={faUpload}/>
            </div>
          </div>}
          <Components.PlanetSidebar terms={{
            view: 'byUserId',
            userId: this.props.currentUser._id,
            limit: 10000
          }} />
          <Components.ChannelSidebar/>
          <Components.MessageArea 
            terms={{
              view: 'byChannel',
              channelId: channelIdToSet,
              limit: messageLimit
            }}
            planet={this.state.planet}
          />
        </div> }
        {!this.props.currentUser && <div className="login-main">
          <div className="login-form">
            <div>
              <Components.AccountsLoginForm redirect={false} className="login-alf"/>
              © 2019 Littrellbox
            </div>
          </div>
        </div> }
      </ChatContext.Provider>
    )
  }
}

const options = {
  collectionName: "PlanetMembers"
};

registerComponent({ name: 'Main', component: Main, hocs: [withCurrentUser, [withUpdate, options]] });