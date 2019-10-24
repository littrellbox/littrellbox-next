import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

class ChannelHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropdown: false
    }
  }

  toggleMenu() {
    this.setState({
      showDropdown: !this.state.showDropdown
    })
  }

  render() {
    return (
      <div className="channel-header">
        <div className="channel-header-planet">
          {this.props.planet.name}
        </div>
        <div className="channel-header-user">
          {this.props.currentUser.username}
        </div>
        <div className="channel-header-dropdown-toggle">
            <FontAwesomeIcon icon={faAngleDown}/>
        </div> 
      </div>
    )
  }
}

registerComponent({ name: 'ChannelHeader', component: ChannelHeader, hocs: [withCurrentUser] });