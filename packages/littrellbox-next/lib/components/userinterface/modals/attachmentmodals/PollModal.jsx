import React from 'react'
import { registerComponent, withCreate, withCurrentUser } from 'meteor/vulcan:core';

class PollModal extends React.Component {
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

      </div>
    )
  }
}

const options = {
  collectionName: "Polls"
};

registerComponent({ name: 'PollModal', component: PollModal, hocs: [[withCreate, options], withCurrentUser] });