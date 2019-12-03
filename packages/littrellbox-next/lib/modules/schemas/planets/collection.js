import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

import Channels from '../channels/collection'
import Messages from '../messages/collection'
import PlanetMembers from '../planetmembers/collection'

const Planets = createCollection({
  collectionName: 'Planets',
  typeName: 'Planet',
  schema,
  
  resolvers: getDefaultResolvers('Planets'),
  mutations: getDefaultMutations('Planets'),

  permissions: {
    canCreate: ['members'],
    canRead: ['members'],
    canUpdate: ['owners', 'admins', 'moderators'],
    canDelete: ['owners', 'admins', 'moderators'],
  },

  callbacks: {
    delete: {
      after: [(document, properties) => {
        Channels.remove({planetId: document._id})
        PlanetMembers.remove({planetId: document._id})
        Messages.remove({planetId: document._id})
        return null
      }]
    }
  }
});

Planets.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

Planets.addView('byFeatured', terms => ({
  selector: {
    featured: terms.featured
  }
}));

export default Planets;