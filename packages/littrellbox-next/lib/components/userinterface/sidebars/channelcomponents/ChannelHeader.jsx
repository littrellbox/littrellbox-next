import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withUpdate } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faStar } from '@fortawesome/free-solid-svg-icons'

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
              Account Settings
            </div>
            <div className="dropdown-item" onClick={() => this.toggleAbout()}>
              About Littrellbox
            </div>
            {this.props.currentUser.isAdmin && <div className="dropdown-item" onClick={() => this.toggleFeatured()}>
              {this.props.planet.featured ? <span>Unfeature Server</span> : <span>Feature Server</span>}
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

registerComponent({ name: 'ChannelHeader', component: ChannelHeader, hocs: [withCurrentUser, [withUpdate, options]] });