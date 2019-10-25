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

  reverseWorkaround() {
    return [...this.props.items].reverse()
  }

  handleScroll(e) {
    condition = e.target.scrollTop < (e.target.scrollTopMax - 100)
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

  render() {
    return (
      <div className="message-list" onScroll={(e) => this.handleScroll(e)}>
        <div>
          {this.reverseWorkaround().map(message => <Components.Message 
            key={message._id} 
            message={message} 
            documentId={message.userId}
            scrollToBottom={() => this.componentDidUpdate()}
            isScrolled={this.state.isScrolled}
          />)}
        </div>
        <div ref={(el) => { this.messagesEnd = el; }}/>
      </div>
    )
  }
}

registerComponent({ name: 'MessageList', component: MessageList, hocs: [withCurrentUser] });