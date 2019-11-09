import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withUpdate, withDelete } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faStar, faCog, faInfo, faTimes } from '@fortawesome/free-solid-svg-icons'

import { ChatContext } from '../../../../contexts/ChatContext'

import Tooltip from '../../../lib/Tooltip'

class ChannelHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropdown: false,
      showSettings: false,
      showAbout: false
    }
  }

  toggleMenu() {
    this.setState({
      showDropdown: !this.state.showDropdown
    })
  }

  toggleSettings() {
    this.setState({
      showSettings: !this.state.showSettings,
      showDropdown: false
    })
  }

  toggleAbout() {
    this.setState({
      showAbout: !this.state.showAbout,
      showDropdown: false
    })
  }

  toggleFeatured() {
    featured = true
    if(!this.props.planet.featured)
      featured = true
    documentId = this.props.planet._id
    this.props.updatePlanet({
      selector: {documentId},
      data: {
        featured: featured
      }
    })
    this.setState({
      showDropdown: false
    })
  }

  leavePlanet(member) {
    documentId = member._id
    this.props.deletePlanetMember({documentId})
  }

  render() {
    return (
      <div className="channel-header">
        <div className="channel-header-planet">
          {this.props.planet.name} {this.props.planet.featured && <Tooltip text="Featured Server"><FontAwesomeIcon icon={faStar}/></Tooltip>}
        </div>
        <div className="channel-header-user">
          {this.props.currentUser.username}
        </div>
        <div className="channel-header-dropdown-toggle">
          <FontAwesomeIcon icon={faAngleDown} onClick={() => this.toggleMenu()}/>
          {this.state.showDropdown && <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => this.toggleSettings()}>
            <FontAwesomeIcon icon={faCog} className="dropdown-icon"/> Account Settings
            </div>
            <ChatContext.Consumer>
              {({planetMember, clearPlanet}) => (
                <div className="dropdown-item" onClick={() => {this.leavePlanet(planetMember); clearPlanet()}}>
                  <FontAwesomeIcon icon={faTimes} className="dropdown-icon"/> Leave Planet
                </div>
              )}
            </ChatContext.Consumer>
            <div className="dropdown-item" onClick={() => this.toggleAbout()}>
              <FontAwesomeIcon icon={faInfo} className="dropdown-icon"/> About Littrellbox
            </div>
            {this.props.currentUser.isAdmin && <div className="dropdown-item" onClick={() => this.toggleFeatured()}>
            <FontAwesomeIcon icon={faStar} className="dropdown-icon"/> {this.props.planet.featured ? <span>Unfeature Server</span> : <span>Feature Server</span>}
            </div>}
          </div>}
          {this.state.showSettings && <div>
            <Components.SettingsModal toggleSettings={() => this.toggleSettings()}/>
            <div className="dialog-semi-transparent-background" onClick={() => this.toggleSettings()}/>
          </div>}
          {this.state.showAbout && <div>
            <Components.AboutModal/>
            <div className="dialog-semi-transparent-background" onClick={() => this.toggleAbout()}/>
          </div>}
        </div> 
        {this.state.showDropdown && <div className="dialog-transparent-background" onClick={() => this.toggleMenu()}/>}
      </div>
    )
  }
}

const options = {
  collectionName: "Planets"
}

const optionsDelete = {
  collectionName: "PlanetMembers"
}

registerComponent({ name: 'ChannelHeader', component: ChannelHeader, hocs: [withCurrentUser, [withUpdate, options], [withDelete, optionsDelete]] });