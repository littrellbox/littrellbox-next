import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

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

  callbacks: {
    create: {
      validate: [(validationErrors, document) => {
        let errors = validationErrors;

        let planetMember = PlanetMembers.findOne({
          userId: document.currentUser._id,
          planetId: document.data.planetId
        });

        if(planetMember) {
          errors.push("0018:ALREADY_IN_PLANET")
        }

        return errors
      }]
    }
  }
});

PlanetMembers.addDefaultView(() => ({
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
}));

export default PlanetMembers;