import React from 'react'
import { registerComponent, withSingle, withCurrentUser, withUpdate } from 'meteor/vulcan:core'

class MessagePollAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullView: false
    }
  }

  answerPoll(index) {
    let documentId = this.props.document._id;
    let workingObject  = JSON.parse(this.props.document.pollObject);
    workingObject[index].push(this.props.currentUser.username);
    let workingString = JSON.stringify(workingObject)
    this.props.updatePoll({
      selector: { documentId },
      data: {
        pollObject: workingString
      }
    })
  }

  componentDidUpdate() {
    this.props.scrollToBottom()
  }

  componentDidMount() {
    this.props.scrollToBottom()
  }

  getPollQuestions() {
    console.log(this.props.document.pollObject)
    return Object.entries(JSON.parse(this.props.document.pollObject))
  }

  isVoted(array) {
    if(array.includes(this.props.currentUser.username))
      return " message-attachment-poll-answered"
    return ""
  }

  render() {
    if(!this.props.loading) {
      return (
        <div className="message-attachment-file">
          <span className="message-attachment-poll-name">{this.props.document.pollText}</span>
          <div className="message-attachment-poll-container">
            {this.getPollQuestions().map((currentValue, index) => (<div key={index} onClick={() => this.answerPoll(currentValue[0])} className={"message-attachment-poll-answer" + this.isVoted(currentValue[1])}>{currentValue[0]}</div>))}
          </div>
        </div>
      )
    }
    return null
  }
}

const options = {
  collectionName: "Polls",
  queryOptions: { pollInterval: 1000 }
};

registerComponent({ name: 'MessagePollAttachment', component: MessagePollAttachment, hocs: [withCurrentUser, [withUpdate, options], [withSingle, options]]});