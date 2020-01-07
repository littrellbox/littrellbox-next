import React from 'react';
import { withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class NewPlanetButton extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  render() {
    return(
      <div className="new-planet-button" onClick={this.props.onClick}>
        <div className="new-planet-button-inner">
          <FontAwesomeIcon icon={faPlus}/>
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'NewPlanetButton', component: NewPlanetButton, hocs: [withCurrentUser] });