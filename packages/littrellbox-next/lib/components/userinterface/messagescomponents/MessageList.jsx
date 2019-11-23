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

  shouldComponentUpdate(newProps) {
    if(this.props.loading !== newProps.loading)
      return true;
    if(this.props.count !== newProps.count)
      return true;
    if(this.props.items !== newProps.items)
      return true;
    if(this.props.planet !== newProps.planet)
      return true;
    return false;
  }

  isAtBottom = true

  forcePositionUpdate() {
    if(this.messagesList) {
      const messageList = this.messagesList;
      const scrollPos = messageList.scrollTop;
      const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
      this.isAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom); 
    }
  }

  getSnapshotBeforeUpdate() {
    const messageList = this.messagesList;
    const scrollPos = messageList.scrollTop;
    const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
    this.isAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom); 
    return null
  }

  componentDidUpdate() {
    if(this.messagesEnd && this.isAtBottom)
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
    condition = e.target.scrollTop == 0

    if(condition && this.props.count != this.props.totalCount) {
      this.props.loadMore()
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
              key: workingArray[workingArray.length - 1]._id
            })
            workingArray = []
          }
          
          if(messageObjects[i].userId != messageLastId) {
            workingArray.push(messageObjects[i])
            messageLastId = workingArray[workingArray.length - 1].userId
          }
        }
        
        //push remaining content, if we have any
        objectsArray.push({
          messages: workingArray,
          key: workingArray[workingArray.length - 1]._id
        })
  
        return objectsArray
      } else {
        return []
      }
    }
  }

  render() {
    return (
      <div className="message-list" ref={(el) => { this.messagesList = el; }} onScroll={(e) => this.handleScroll(e)}>
        <div>
          {!this.props.loading && this.generateMessageObjects(this.reverseWorkaround()).map(messageObject => <Components.MessageContainer
            key={messageObject.key}
            messages={messageObject.messages}
            documentId={messageObject.messages[0].userId}
            scrollToBottom={() => this.componentDidUpdate()}
            scrollToBottomMessageMount={() => this.messageMountScroll()}
            forcePositionUpdate={() => this.forcePositionUpdate()}
            isScrolled={this.state.isScrolled}
            planet={this.props.planet}
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