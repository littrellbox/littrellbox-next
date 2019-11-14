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

        if(!document.data.planetId && !document.data.isDm) {
          errors.push("0010:MISSING_PLANET_ID")
        }

        if(document.data.isDm && !document.data.dmUserIds) {
          errors.push("0019:MISSING_DM_USER_IDS")
        }

        if(!document.data.name) {
          errors.push("0011:NO_NAME")
        }

        planet = Planets.findOne(document.data.planetId)

        if(document.data.isDm && (planet.userId != document.currentUser._id)) {
          errors.push("0012:NO_PERMISSION")
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