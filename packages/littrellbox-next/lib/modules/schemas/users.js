import Users from 'meteor/vulcan:users'
import { extendFragment } from 'meteor/vulcan:core'

Users.createGroup('moderators')

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
  {
    fieldName: 'lb_muted',
    fieldSchema: { 
      label: 'Mute',
      type: Number,
      optional: true,
      canRead: ['guests'],
      canCreate: ['admins', 'moderators'],
      canUpdate: ['admins', 'moderators']
    }
  },
  {
    fieldName: 'lb_filesBlocked',
    fieldSchema: { 
      label: 'Block Uploads',
      type: Number,
      optional: true,
      canRead: ['guests'],
      canCreate: ['admins', 'moderators'],
      canUpdate: ['admins', 'moderators']
    }
  },
]);

extendFragment('UsersCurrent', `
  lb_profilePicture
  lb_muted
  lb_filesBlocked
`)

extendFragment('UsersDefaultFragment', `
  lb_profilePicture
  lb_muted
  lb_filesBlocked
`)