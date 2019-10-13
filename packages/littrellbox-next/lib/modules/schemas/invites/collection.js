import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Invites = createCollection({
  collectionName: 'Invites',
  typeName: 'Invite',
  schema,
  
  resolvers: getDefaultResolvers('Invites'),
  mutations: getDefaultMutations('Invites'),

});

//set up some permissions
const membersActions = [
  'invites.new',
  'invites.edit.own',
  'invites.remove.own',
];

Users.groups.members.can(membersActions);

Invites.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

Invites.addView('byChannelId', terms => ({
  selector: {
    channelId: terms.channelId
  }
}));

export default Invites;