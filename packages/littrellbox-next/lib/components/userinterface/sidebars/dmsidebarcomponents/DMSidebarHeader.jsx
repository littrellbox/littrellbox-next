import React from 'react';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faCog, faInfo } from '@fortawesome/free-solid-svg-icons'

import { HiddenWithMoveUp, Visible, Hidden } from '../../../lib/AnimationStyles'

class DMSidebarHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      showSettings: false,
      showAbout: false
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(this.state !== nextState)
      return true;
    return this.props.currentUser !== nextProps.currentUser
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
          <div className="dropdown-menu" style={this.state.showDropdown ? Visible : HiddenWithMoveUp}>
            <div className="dropdown-item" onClick={() => this.toggleSettings()}>
              <FontAwesomeIcon icon={faCog} className="dropdown-icon"/> Account Settings
            </div>
            <div className="dropdown-item" onClick={() => this.toggleAbout()}>
              <FontAwesomeIcon icon={faInfo} className="dropdown-icon"/> About Littrellbox
            </div>
          </div>
          <div>
            <Components.SettingsModal style={this.state.showSettings ? Visible : HiddenWithMoveUp} toggleSettings={() => this.toggleSettings()}/>
            <div className="dialog-semi-transparent-background" style={this.state.showSettings ? Visible : Hidden} onClick={() => this.toggleSettings()}/>
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

registerComponent({ name: 'DMSidebarHeader', component: DMSidebarHeader, hocs: [withCurrentUser] });