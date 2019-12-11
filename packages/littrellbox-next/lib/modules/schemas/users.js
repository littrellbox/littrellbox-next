import Users from 'meteor/vulcan:users'
import { extendFragment } from 'meteor/vulcan:core'

Users.createGroup('moderators');

Users.addView('byUsername', terms => ({
  selector: {
    username: terms.username
  }
}));

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
  {
    fieldName: 'lb_usersBlocked',
    fieldSchema: {
      label: 'Blocked Users',
      type: Array,
      optional: true,
      canRead: ['guests'],
      canCreate: ['members'],
      canUpdate: ['members'],
    }
  },
  {
    fieldName: 'lb_usersBlocked.$',
    fieldSchema: String
  }
]);

extendFragment('UsersCurrent', `
  lb_profilePicture
  lb_muted
  lb_filesBlocked
  lb_usersBlocked
`);

extendFragment('UsersDefaultFragment', `
  lb_profilePicture
  lb_muted
  lb_filesBlocked
  lb_usersBlocked
`);
