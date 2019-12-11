import React from 'react';

import { Components, withCurrentUser, registerComponent, withUpdate, withDelete } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faStar, faCog, faInfo, faTimes } from '@fortawesome/free-solid-svg-icons'

import { HiddenWithMoveUp, Visible, Hidden } from '../../../lib/AnimationStyles'

import { ChatContext } from '../../../../contexts/ChatContext'

import Tooltip from '../../../lib/Tooltip'

class ChannelHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      showSettings: false,
      showAbout: false,
      showPlanet: false,
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

  togglePlanet() {
    this.setState({
      showPlanet: !this.state.showPlanet,
      showDropdown: false
    })
  }

  toggleFeatured() {
    let featured = true;
    if(!this.props.planet.featured)
      featured = true;
    let documentId = this.props.planet._id;
    this.props.updatePlanet({
      selector: {documentId},
      data: {
        featured: featured
      }
    });
    this.setState({
      showDropdown: false
    })
  }

  leavePlanet(member) {
    let documentId = member._id;
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
          <div className="dropdown-menu" style={this.state.showDropdown ? Visible : HiddenWithMoveUp}>
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
            {this.props.planet.userId === this.props.currentUser._id && <div className="dropdown-item" onClick={() => this.togglePlanet()}>
              <FontAwesomeIcon icon={faCog} className="dropdown-icon"/> Planet Settings
            </div>}
            <div className="dropdown-item" onClick={() => this.toggleAbout()}>
              <FontAwesomeIcon icon={faInfo} className="dropdown-icon"/> About Littrellbox
            </div>
            {this.props.currentUser.isAdmin && <div className="dropdown-item" onClick={() => this.toggleFeatured()}>
            <FontAwesomeIcon icon={faStar} className="dropdown-icon"/> {this.props.planet.featured ? <span>Unfeature Server</span> : <span>Feature Server</span>}
            </div>}
          </div>
          <div>
            <Components.SettingsModal style={this.state.showSettings ? Visible : HiddenWithMoveUp} toggleSettings={() => this.toggleSettings()}/>
            <div className="dialog-semi-transparent-background" style={this.state.showSettings ? Visible : Hidden} onClick={() => this.toggleSettings()}/>
          </div>
          <div>
            <Components.PlanetModal style={this.state.showPlanet ? Visible : HiddenWithMoveUp} planet={this.props.planet}/>
            <div className="dialog-semi-transparent-background" style={this.state.showPlanet ? Visible : Hidden} onClick={() => this.togglePlanet()}/>
          </div>
          <div>
            <Components.AboutModal style={this.state.showAbout ? Visible: HiddenWithMoveUp}/>
            <div className="dialog-semi-transparent-background" style={this.state.showAbout ? Visible: Hidden} onClick={() => this.toggleAbout()}/>
          </div>
        </div> 
        {this.state.showDropdown && <div className="dialog-transparent-background" onClick={() => this.toggleMenu()}/>}
      </div>
    )
  }
}

const options = {
  collectionName: "Planets"
};

const optionsDelete = {
  collectionName: "PlanetMembers"
};

registerComponent({ name: 'ChannelHeader', component: ChannelHeader, hocs: [withCurrentUser, [withUpdate, options], [withDelete, optionsDelete]] });