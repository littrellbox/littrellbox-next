import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

import PlanetMembers from '../planetmembers/collection'
import Planets from '../planets/collection'

const canRead = ({ document, user }) => {
  if(document.isDm && !document.dmUserIds.includes(user._id)) {
    return false
  } else if(document.isDm) {
    return true
  }

  planetMember = PlanetMembers.findOne({
    userId: user._id,
    planetId: document.planetId
  })

  if(!planetMember) {
    return false
  }
  
  return true
};

const Channels = createCollection({
  collectionName: 'Channels',
  typeName: 'Channel',
  schema,
  
  resolvers: getDefaultResolvers('Channels'),
  mutations: getDefaultMutations('Channels'),

  permissions: {
    canCreate: ['members'],
    canRead: canRead,
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

        if(!document.data.name) {
          errors.push("0011:NO_NAME")
        }

        planet = Planets.findOne(document.data.planetId)
        
        if(document.data.dmUserIds.filter(item => item == document.currentUser._id).length == 2) {
          errors.push("0021:NO_SELF_DM")
        }

        if(document.data.isDm) {
          if(!document.data.dmUserIds) {
            errors.push("0019:MISSING_DM_USER_IDS")
          }

          if(document.data.dmUserIds.length = 2) {
            channel = Channels.findOne({dmUserIds: {$all: document.data.dmUserIds, $size:2}})

            if(channel) {
              errors.push("0020:DM_CHANNEL_ALREADY_EXISTS")
            }
          }
        }

        if(!document.data.isDm && (planet.userId != document.currentUser._id)) {
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

Channels.addView("getDms", terms => ({
  selector: {
    dmUserIds: terms.userId
  }
}))

export default Channels;