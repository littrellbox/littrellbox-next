import { createCollection, getDefaultResolvers, Connectors, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import { PathErrorStats } from 'apollo-engine-reporting-protobuf';

import PlanetMembers from '../planetmembers/collection'
import Planets from '../planets/collection'
import Channels from '../channels/collection'

const canRead = ({ document, user }) => {
  channel = Channels.findOne(document.channelId)
  
  if(channel.isDm && !channel.dmUserIds.includes(user._id)) {
    return false
  } else if(channel.isDm) {
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
          errors.push("0001:MISSING_CHANNEL_ID")
        }

        channel = Channels.findOne(document.data.channelId)

        if(!channel.isDm && !document.data.planetId) {
          errors.push("0002:MISSING_PLANET_ID")
        }

        if(channel.isDm && !channel.dmUserIds.includes(document.currentUser._id)) {
          errors.push("0021:NOT_IN_DM")
        }

        /*if(!document.data.text) {
          errors.push("0003:MISSING_TEXT")
        }*/

        if(document.currentUser.lb_muted == 1) {
          errors.push("0004:MUTED")
        }

        planet = Planets.findOne(document.data.planetId)
        planetMember = PlanetMembers.findOne({
          userId: document.currentUser._id,
          planetId: document.data.planetId
        })

        if(!channel.isDm && !planet) {
          errors.push("0005:FAKE_PLANET")
        }

        if(!channel) {
          errors.push("0006:FAKE_CHANNEL")
        }

        if(!channel.isDm && !planetMember) {
          errors.push("0007:NOT_IN_PLANET")
        }

        if(channel.planetId != document.data.planetId) {
          errors.push("0008:CHANNEL_MISMATCH")
        }

        return errors;
      }],
      after:[(document, properties) => {
        planet = Planets.findOne(document.planetId)
        if(!planet.lastMessagesArray)
          planet.lastMessagesArray = []

        planet.lastMessagesArray[document.channelId] = new Date()
        console.log(planet) 
        Connectors['mongo'].update(Planets, document.planetId, {lastMessagesArray: planet.lastMessagesArray})

        return document;
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
