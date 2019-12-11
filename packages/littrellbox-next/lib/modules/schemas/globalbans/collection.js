import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

import schema from './schema.js';

const GlobalBans = createCollection({
  collectionName: 'GlobalBans',
  typeName: 'GlobalBans',
  schema,
  
  resolvers: getDefaultResolvers('GlobalBans'),
  mutations: getDefaultMutations('GlobalBans'),

  permissions: {
    canCreate: ['admins', 'moderators'],
    canRead: ['members'],
    canUpdate: ['owners', 'admins', 'moderators'],
    canDelete: ['owners', 'admins', 'moderators'],
  },
});

GlobalBans.addDefaultView(() => ({
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