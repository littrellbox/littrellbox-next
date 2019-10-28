import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withCreate } from 'meteor/vulcan:core';

import '../../../../modules/schemas/planets/collection'

class NewPlanet extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showingNewPlanetDialog: false,
      textboxText: ""
    }
  }

  handleKeyPress(e) {
    if(e.key == "Enter") {
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
        })
        this.props.createPlanetMember({
          data: { 
            planetId: value.data.createPlanet.data._id
          }
        })
      })
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
        {this.state.showingNewPlanetDialog && <div className="fullscreen">
          <div 
            onClick={() => this.handleClick()} 
            className="dialog-semi-transparent-background"
          />
          <div className="dialog-no-bg">
            <input 
              type="text"
              className="new-planet-textbox"
              placeholder="Type a name and press Enter"
              onChange={(e) => this.handleChange(e)}
              onKeyPress={(e) => this.handleKeyPress(e)}
            />
          </div>
        </div>}
      </div>
    )
  }
}

/*const NewPlanet = ({ currentUser, createPlanetMember, createChannel, closeModal }) => (
  <div className="new-planet"> 
    <Components.ModalTrigger size="large" title="New Planet" component={<div><Components.NewPlanetButton/></div>}>
      <Components.SmartForm
        collectionName="Planets"
        successCallback={(document, options) => {
          options.form.props.closeModal()
          createChannel({
            data: {
              planetId: document._id,
              name: "general"
            }
          })
          createPlanetMember({
            data: { 
              planetId: document._id 
            }
          })
        }}
      />
    </Components.ModalTrigger>
  </div>
);*/

const optionsMember = {
  collectionName: 'PlanetMembers'
}

const optionsChannel = {
  collectionName: 'Channels'
}

const optionsPlanet = {
  collectionName: 'Planets'
}

registerComponent({ name: 'NewPlanet', component: NewPlanet, hocs: [withCurrentUser, [withCreate, optionsPlanet], [withCreate, optionsMember], [withCreate, optionsChannel]] });