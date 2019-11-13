import React from 'react';
import { Components, withCurrentUser, registerComponent, withUpdate, withDelete } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faStar, faCog, faInfo } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '../../../lib/Tooltip'

class DMSidebarHeader extends React.Component {
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

  render() {
    return (
      <div className="dm-sidebar-header">
        <div className="dm-sidebar-header-username">
          {this.props.currentUser.username}
        </div>
        <div className="dm-sidebar-header-dropdown-toggle">
          <FontAwesomeIcon icon={faAngleDown} onClick={() => this.toggleMenu()}/>
          {this.state.showDropdown && <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => this.toggleSettings()}>
              <FontAwesomeIcon icon={faCog} className="dropdown-icon"/> Account Settings
            </div>
            <div className="dropdown-item" onClick={() => this.toggleAbout()}>
              <FontAwesomeIcon icon={faInfo} className="dropdown-icon"/> About Littrellbox
            </div>
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

registerComponent({ name: 'DMSidebarHeader', component: DMSidebarHeader, hocs: [withCurrentUser] });