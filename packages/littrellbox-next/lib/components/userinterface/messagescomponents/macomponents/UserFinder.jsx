import React from 'react'
import { Components, withCurrentUser, registerComponent, withMulti, withCreate, withUpdate } from 'meteor/vulcan:core';

import Loading from '../../../lib/Loader'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHashtag, faUsers, faUserPlus} from '@fortawesome/free-solid-svg-icons'

class UserFinder extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(oldProps) {
    if(this.props.terms.username != oldProps.terms.username) {
      this.props.refetch()
    }
    if(this.props.results && this.props.results[0]) {
      this.props.updateId(this.props.results[0]._id)
    } else {
      this.props.updateId(null)
    }
  }

  render() {
    if(!this.props.loading) {
      if(this.props.results[0]) {
        console.log(this.props.results[0])
        if(!this.props.results[0].lb_profilePicture) {
          return (
            <div className="mah-add-user-pfp"/>
          )
        }
        return(
          <img src={this.props.results[0].lb_profilePicture} className="mah-add-user-pfp"/>
        )
      }
      return <div/>
    } else {
      return (
        <div className="user-finder-loading">
          <Loading className="mah-add-user-loader"/>
        </div>
      )
    }
  }
}

const channelOptions = {
  collectionName: "Channels"
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'UserFinder', component: UserFinder, hocs: [withCurrentUser, [withMulti, options]]});