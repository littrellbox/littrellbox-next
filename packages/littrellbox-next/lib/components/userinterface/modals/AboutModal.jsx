import React from 'react'
import { registerComponent } from 'meteor/vulcan:core';

class AboutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editUsername: false,
      textboxText: ""
    }
  }

  render() {
    return (
      <div className="about-modal" style={this.props.style}>
        <div className="about-header">
          Littrellbox
        </div>
        <div className="about-version">
          Alpha 3.0.2
        </div>
        <div className="about-copyright">
          © 2019 Littrellbox. Portions of this software are licensed<br/>
          under various open source licenses.
        </div>
      </div>
    )
  }
}

registerComponent({ name: 'AboutModal', component: AboutModal });