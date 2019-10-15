import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Messages = createCollection({
  collectionName: 'Messages',
  typeName: 'Message',
  schema,
  
  resolvers: getDefaultResolvers('Messages'),
  mutations: getDefaultMutations('Messages'),

});

//set up some permissions
const membersActions = [
  'messages.new',
  'messages.edit.own',
  'messages.remove.own',
];

Users.groups.members.can(membersActions);

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