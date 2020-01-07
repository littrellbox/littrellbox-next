import React from 'react';

import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';

import '../../../../modules/schemas/planets/collection'

import { Hidden, HiddenWithMoveUp, Visible, PointerEventsWorkaround} from '../../../lib/AnimationStyles'

class NewPlanet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showingNewPlanetDialog: false,
      textboxText: ""
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state !== nextState;
  }

  handleKeyPress(e) {
    if(e.key === "Enter") {
      this.props.createPlanet({
        data: {
          name: this.state.textboxText
        }
      }).then((value) => {
        this.props.createChannel({
          data: {
            planetId: value.data.createPlanet.data._id,
            name: "general"
          }
        });
        this.props.createPlanetMember({
          data: { 
            planetId: value.data.createPlanet.data._id
          }
        })
      });
      this.setState({
        showingNewPlanetDialog: false
      })
    }
  }

  handleChange(e) {
    this.setState({
      textboxText: e.target.value
    })
  }


  handleClick() {
    this.setState({
      showingNewPlanetDialog: !this.state.showingNewPlanetDialog
    })
  }

  render() {
    return(
      <div className="new-planet">
        <Components.NewPlanetButton onClick={() => this.handleClick()}/>
        <div className="fullscreen" style={this.state.showingNewPlanetDialog ? {} : PointerEventsWorkaround}>
          <div 
            onClick={() => this.handleClick()} 
            className="dialog-semi-transparent-background"
            style={this.state.showingNewPlanetDialog ? Visible : Hidden}
          />
          <div className="dialog-no-bg" style={this.state.showingNewPlanetDialog ? Visible : HiddenWithMoveUp}>
            <input 
              type="text"
              className="new-planet-textbox"
              placeholder="Type a name and press Enter"
              onChange={(e) => this.handleChange(e)}
              onKeyPress={(e) => this.handleKeyPress(e)}
            />
          </div>
        </div>
      </div>
    )
  }
}

const optionsMember = {
  collectionName: 'PlanetMembers'
};

const optionsChannel = {
  collectionName: 'Channels'
};

const optionsPlanet = {
  collectionName: 'Planets'
};

registerComponent({ name: 'NewPlanet', component: NewPlanet, hocs: [withCurrentUser, [withCreate, optionsPlanet], [withCreate, optionsMember], [withCreate, optionsChannel]] });