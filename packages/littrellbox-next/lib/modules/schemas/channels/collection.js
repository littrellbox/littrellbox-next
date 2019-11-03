import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

import Planets from '../planets/collection'

const Channels = createCollection({
  collectionName: 'Channels',
  typeName: 'Channel',
  schema,
  
  resolvers: getDefaultResolvers('Channels'),
  mutations: getDefaultMutations('Channels'),

  permissions: {
    canCreate: ['members'],
    canRead: ['members'],
    canUpdate: ['owners', 'admins', 'moderators'],
    canDelete: ['owners', 'admins', 'moderators'],
  },

  callbacks: {
    create: {
      validate: [(validationErrors, document, properties) => { 
        errors = validationErrors

        if(!document.data.planetId) {
          errors.push("missing_planet_id")
        }

        if(!document.data.name) {
          errors.push("no_name")
        }

        planet = Planets.findOne(document.data.planetId)

        if(planet.userId != document.currentUser._id) {
          errors.push("no_permission")
        }

        return errors;
       }]
    }
  }
});

Channels.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

Channels.addView('byPlanetId', terms => ({
  selector: {
    planetId: terms.planetId
  }
}));

export default Channels;