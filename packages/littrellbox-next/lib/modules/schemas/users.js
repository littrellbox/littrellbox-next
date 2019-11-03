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
]);

Users.addField([
  {
    fieldName: 'lb_muted',
    fieldSchema: { 
      label: 'Mute',
      type: Boolean,
      optional: true,
      defaultValue: "",
      canRead: ['guests'],
      canCreate: ['admins', 'moderators'],
      canCreate: ['admins', 'moderators']
    }
  },
]);

Users.addField([
  {
    fieldName: 'lb_filesAllowed',
    fieldSchema: { 
      label: 'Allowed to upload',
      type: Boolean,
      optional: true,
      defaultValue: "",
      canRead: ['guests'],
      canCreate: ['admins', 'moderators'],
      canCreate: ['admins', 'moderators']
    }
  },
]);

extendFragment('UsersCurrent', `
  lb_profilePicture
`)

extendFragment('UsersDefaultFragment', `
  lb_profilePicture
`)