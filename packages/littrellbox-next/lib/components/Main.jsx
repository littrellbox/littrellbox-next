import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import Dropzone from 'react-dropzone'

//import context
import {ChatContext} from '../contexts/ChatContext'

import {faUpload} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { flattenProp } from 'recompose';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.switchPlanet = (planetToSet) => {
      this.setState(state => ({
        planet: planetToSet,
        attachments: []
      }));
    };

    this.switchChannel = (channelToSet) => {
      this.setState(state => ({
        channel: channelToSet,
        attachments: []
      }));
    };

    this.onDrop = (acceptedFiles) => {
      attachments = this.state.attachments
      Array.from(acceptedFiles).forEach(element => {
        attachments.push(element)
      });
      this.setState({
        attachments: attachments
      })
    }

    this.removeFile = (key) => {
      attachments = this.state.attachments
      attachments.splice(key, 1)
      this.setState({
        attachments: attachments
      })
    }

    this.removeAllFiles = () => {
      this.setState({
        attachments: []
      })
    }

    this.state = {
      planet: {},
      channel: {},
      switchPlanet: this.switchPlanet,
      switchChannel: this.switchChannel,
      onDrop: this.onDrop,
      removeFile: this.removeFile,
      removeAllFiles: this.removeAllFiles,
      attachments: [],      
      showingDropDialog: false
    };
  }

  onDragStart(evt) {
    evt.preventDefault()
    if(!this.state.showingDropDialog)
      this.setState({
        showingDropDialog: true
      })
  }

  onDragStop(evt) {
    evt.preventDefault()
    this.setState({
      showingDropDialog: false
    })
  }

  onCCDrop(evt) {
    evt.preventDefault()
    evt.stopPropagation()
    this.setState({
      showingDropDialog: false
    })

    console.log(evt.dataTransfer.files)
    console.log(this.onDrop)
    this.onDrop(Array.from(evt.dataTransfer.files))
  }

  render() {
    return (
      <ChatContext.Provider 
        value={this.state} 
        className="main"
      > 
        <Helmet>
          <link href="https://unpkg.com/emoji-mart@2.11.1/css/emoji-mart.css" rel="stylesheet"/>
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
          {this.state.showingDropDialog && <div className="file-dropzone-upload">
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
          <Components.MessageArea terms={{
            view: 'byChannel',
            channelId: this.state.channel._id,
            limit: 35
          }}/>
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

registerComponent({ name: 'Main', component: Main, hocs: [withCurrentUser] });

/*        <Dropzone onDrop={(acceptedFiles) => this.state.onDrop(acceptedFiles)} noClick>
            {({getRootProps, getInputProps, isDragActive}) => (
              <section>
                <span className="file-dropzone" {...getRootProps()}>
                  <input {...getInputProps()}/>
                  {isDragActive && <div className="file-dropzone-upload">
                    <div className="file-dropzone-icon"> 
                      <FontAwesomeIcon icon={faUpload}/>
                    </div>
                  </div>}
                </span>
              </section>
            )}
          </Dropzone> */