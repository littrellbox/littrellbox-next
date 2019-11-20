import React from 'react'
import { Components, withCurrentUser, registerComponent, withMulti } from 'meteor/vulcan:core';

import Loading from '../../../lib/Loader'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHashtag, faUsers, faUserPlus} from '@fortawesome/free-solid-svg-icons'

class UserFinder extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if(this.props.document) {
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