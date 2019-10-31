import Users from 'meteor/vulcan:users'
import { extendFragment } from 'meteor/vulcan:core'

Users.addField([
  {
    fieldName: 'lb_profilePicture',
    fieldSchema: { 
      label: 'Profile Picture',
      type: String,
      optional: true,
      defaultValue: "",
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members']
    }
  },
]);

extendFragment('UsersCurrent', `
  lb_profilePicture
`)

extendFragment('UsersDefaultFragment', `
  lb_profilePicture
`)