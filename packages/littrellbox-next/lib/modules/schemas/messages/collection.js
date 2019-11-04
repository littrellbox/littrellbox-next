import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import { PathErrorStats } from 'apollo-engine-reporting-protobuf';

import PlanetMembers from '../planetmembers/collection'
import Planets from '../planets/collection'
import Channels from '../channels/collection'

const canRead = ({ document, user }) => {
  planetMember = PlanetMembers.findOne({
    userId: user._id,
    planetId: document.planetId
  })

  if(!planetMember) {
    return false
  }
  
  return true
};

const Messages = createCollection({
  collectionName: 'Messages',
  typeName: 'Message',
  schema,
  
  resolvers: getDefaultResolvers('Messages'),
  mutations: getDefaultMutations('Messages'),

  permissions: {
    canCreate: ['members'],
    canRead,
    canUpdate: ['owners', 'moderators'],
    canDelete: ['owners', 'moderators'],
  },

  callbacks: {
    create: {
      validate: [(validationErrors, document, properties) => { 
        errors = validationErrors
        if(!document.data.channelId) {
          errors.push("missing_channel_id")
        }

        if(!document.data.planetId) {
          errors.push("missing_planet_id")
        }

        if(!document.data.text) {
          errors.push("no_content")
        }

        if(document.currentUser.lb_muted == 1) {
          errors.push("muted")
        }
        
        console.log(document.currentUser)

        channel = Channels.findOne(document.data.channelId)
        planet = Planets.findOne(document.data.planetId)
        planetMember = PlanetMembers.findOne({
          userId: document.currentUser._id,
          planetId: document.data.planetId
        })

        if(!planet) {
          errors.push("fake_planet")
        }

        if(!channel) {
          errors.push("fake_channel")
        }

        if(!planetMember) {
          errors.push("not_in_planet")
        }

        if(channel.planetId != document.data.planetId) {
          errors.push("wrong_planet")
        }

        console.log(errors)
        console.log("validated")

        return errors;
       }]
    }
  }

});

Messages.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: -1
    }
  }
}));

Messages.addView('byChannel', terms => ({
  selector: {
    channelId: terms.channelId
  },
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: -1 
    }
  }
}));

Messages.addView('byPlanet', terms => ({
  selector: {
    planetId: terms.planetId
  },
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

export default Messages;