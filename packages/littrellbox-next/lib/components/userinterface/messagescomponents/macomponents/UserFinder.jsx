import React from 'react'
import { Components, withCurrentUser, registerComponent, withMulti } from 'meteor/vulcan:core';

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
  }

  render() {
    if(this.props.results) {
      if(this.props.results[0]) {
        return(
          <img src={this.props.results[0].lb_profilePicture} className="mah-add-user-pfp"/>
        )
      }
      return null
    } else {
      return (<div className="user-finder-loading">
        <Loading className="mah-add-user-loader"/>
      </div>)
    }
  }
}

const options = {
  collectionName: "Users"
}

registerComponent({ name: 'UserFinder', component: UserFinder, hocs: [withCurrentUser, [withMulti, options]]});