import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

import schema from './schema.js';

const Invites = createCollection({
  collectionName: 'Invites',
  typeName: 'Invite',
  schema,
  
  resolvers: getDefaultResolvers('Invites'),
  mutations: getDefaultMutations('Invites'),

  permissions: {
    canCreate: ['members'],
    canRead: ['members'],
    canUpdate: ['owners', 'admins', 'moderators'],
    canDelete: ['owners', 'admins', 'moderators'],
  },
});

Invites.addDefaultView(() => ({
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