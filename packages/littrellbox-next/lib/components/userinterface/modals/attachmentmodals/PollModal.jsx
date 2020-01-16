import React from 'react'
import { registerComponent, withCreate, withCurrentUser } from 'meteor/vulcan:core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faPlusCircle, faCheck } from '@fortawesome/free-solid-svg-icons'

class PollModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editUsername: false,
      nameTextbox: "",
      questionTextboxes: ["", ""]
    }
  }

  updateTextbox(e, index) {
    let questionTextboxes = this.state.questionTextboxes;
    questionTextboxes[index] = e.target.value;
    this.setState({
      questionTextboxes: questionTextboxes
    })
  }

  updateNameTextbox(e) {
    this.setState({
      nameTextbox: e.target.value
    })
  }

  addQuestion() {
    let questionTextboxes = this.state.questionTextboxes;
    questionTextboxes.push("");
    this.setState({
      questionTextboxes: questionTextboxes
    })
  }

  removeQuestion(index) {
    if(this.state.questionTextboxes.length !== 1) {
      let questionTextboxes = this.state.questionTextboxes;
      questionTextboxes.splice(index, 1);
      this.setState({
        questionTextboxes: questionTextboxes
      })
    }
  }

  submitPoll() {
    let pollObject = {};
    for(const option of this.state.questionTextboxes) {
      pollObject[option] = [];
    }
    this.props.createPoll({
      data: {
        pollText: this.state.nameTextbox,
        pollObject: JSON.stringify(pollObject)
      }
    }).then(dataValue => {
      this.props.addAttachment({
        type: "poll",
        id: dataValue.data.createPoll.data._id,
        name: dataValue.data.createPoll.data.pollText
      })
    })
    this.setState({
      nameTextbox: "",
      questionTextboxes: ["", ""]
    })
    this.props.close();
  }


  render() {
    return (
      <div className="poll-modal" style={this.props.style}>
        <input type="text" value={this.state.nameTextbox} className="poll-name-textbox" placeholder="Title" onChange={(e) => this.updateNameTextbox(e)}/>
        {this.state.questionTextboxes.map((currentValue, index) => (<div key={index} className="poll-textbox">
          <input type="text" value={currentValue} className="poll-textbox-text" placeholder={"Question " + (index + 1)} onChange={(e) => this.updateTextbox(e, index)}/>
          <FontAwesomeIcon icon={faTimesCircle} className="poll-remove-option" onClick={() => this.removeQuestion(index)}/>
        </div>))}
        <FontAwesomeIcon icon={faPlusCircle} className="poll-add-option" onClick={() => this.addQuestion()}/>
        <FontAwesomeIcon icon={faCheck} className="poll-create-check" onClick={() => this.submitPoll()}/>
      </div>
    )
  }
}

const options = {
  collectionName: "Polls"
};

registerComponent({ name: 'PollModal', component: PollModal, hocs: [[withCreate, options], withCurrentUser] });