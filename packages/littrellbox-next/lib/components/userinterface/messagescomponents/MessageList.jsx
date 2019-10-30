import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, Loading, withMulti } from 'meteor/vulcan:core';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isScrolled: false
    }
  }
  
  componentDidUpdate() {
    if(this.messagesEnd && !this.state.isScrolled)
      this.messagesEnd.scrollIntoView({ behavior: "auto" });
  }

  messageMountScroll() {
    if(this.messagesEnd)
      this.messagesEnd.scrollIntoView({ behavior: "auto" });
  }

  reverseWorkaround() {
    return [...this.props.items].reverse()
  }

  handleScroll(e) {
    condition = e.target.scrollTop < (e.target.scrollTopMax - 10)
    if(condition && !this.state.isScrolled) { 
      this.setState({
        isScrolled: true
      })
    }
    if(!condition && this.state.isScrolled) {
      this.setState({
        isScrolled: false
      })
    }
  }

  generateMessageObjects(messageObjects) {
    if(!this.props.loading) {
      if(messageObjects.length != 0) {
        objectsArray = []
        workingArray = []
        messageLastId = ""
        if(messageObjects.length == 1) {
          workingArray.push(messageObjects[0])
          objectsArray.push({
            messages: workingArray,
            key: 1
          })
          return objectsArray
        }
        for(i = 0; i < messageObjects.length; i++) {
          if(messageObjects[i].userId == messageLastId) {
            workingArray.push(messageObjects[i])
          } else if(workingArray.length != 0) {
            objectsArray.push({
              messages: workingArray,
              key: i
            })
            workingArray = []
          }
          
          if(messageObjects[i].userId != messageLastId) {
            workingArray.push(messageObjects[i])
            messageLastId = messageObjects[i].userId
          }
        }
        
        //push remaining content, if we have any
        objectsArray.push({
          messages: workingArray,
          key: messageObjects.length
        })
  
        return objectsArray
      } else {
        return []
      }
    }
  }

  render() {
    return (
      <div className="message-list" onScroll={(e) => this.handleScroll(e)}>
        <div>
          {!this.props.loading && this.generateMessageObjects(this.reverseWorkaround()).map(messageObject => <Components.MessageContainer
            key={messageObject.key}
            messages={messageObject.messages}
            documentId={messageObject.messages[0].userId}
            scrollToBottom={() => this.componentDidUpdate()}
            scrollToBottomMessageMount={() => this.messageMountScroll()}
            isScrolled={this.state.isScrolled}
          />
          )}
          {/*this.reverseWorkaround().map(message => <Components.Message 
            key={message._id} 
            message={message} 
            documentId={message.userId}
            scrollToBottom={() => this.componentDidUpdate()}
            isScrolled={this.state.isScrolled}
          />)*/}
        </div>
        <div ref={(el) => { this.messagesEnd = el; }}/>
      </div>
    )
  }
}

registerComponent({ name: 'MessageList', component: MessageList, hocs: [withCurrentUser] });