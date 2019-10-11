import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';

import { ChatContext } from '../../../../contexts/ChatContext'

class NewChannelForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxText: ""
    };
  }
  
  handleKeyPress(e, planet) {
    if (e.key === 'Enter') {
      this.props.createChannel({
        data: {
          planetId: planet._id,
          name: this.state.textboxText
        }
      })
      this.props.closeModal()
    }
  }

  onChange(event) {
    this.setState({textboxText: event.target.value});
  }

  render() {
    return (
      <ChatContext.Consumer>
        {({planet}) => {
          return (
            <div className="new-channel-textbox">
              <input type="text" className="new-channel-textbox" onKeyPress={(e) => this.handleKeyPress(e, planet)} onChange={(e) => this.onChange(e)} /> 
            </div>
          )
        }}
      </ChatContext.Consumer>
    )
  }
}

const options = {
  collectionName: "Channels"
};

registerComponent({ name: 'NewChannelForm', component: NewChannelForm, hocs: [withCurrentUser, [withCreate, options]] });   