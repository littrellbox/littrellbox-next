import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const GlobalBans = createCollection({
  collectionName: 'GlobalBans',
  typeName: 'GlobalBans',
  schema,
  
  resolvers: getDefaultResolvers('GlobalBans'),
  mutations: getDefaultMutations('GlobalBans'),

});

//set up some permissions
const membersActions = [
  'globalbans.edit.own',
  'globalbans.remove.own',
];

Users.groups.members.can(membersActions);

GlobalBans.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

GlobalBans.addView('byBannedUserId', terms => ({
  selector: {
    bannedUserId: terms.bannedUserId
  }
}));

export default GlobalBans;