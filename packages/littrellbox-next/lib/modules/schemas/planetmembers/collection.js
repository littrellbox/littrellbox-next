import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const PlanetMembers = createCollection({
  collectionName: 'PlanetMembers',
  typeName: 'PlanetMember',
  schema,
  
  resolvers: getDefaultResolvers('PlanetMembers'),
  mutations: getDefaultMutations('PlanetMembers'),

  permissions: {
    canCreate: ['members'],
    canRead: ['members'],
    canUpdate: ['owners', 'admins', 'moderators'],
    canDelete: ['owners', 'admins', 'moderators'],
  },
});

PlanetMembers.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

PlanetMembers.addView('byUserId', terms => ({
  selector: {
    userId: terms.userId
  }
}));

PlanetMembers.addView('userLookup', terms => ({
  selector: {
    userId: terms.userId,
    planetId: terms.planetId
  }
}))

export default PlanetMembers;