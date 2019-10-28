import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Channels = createCollection({
  collectionName: 'Channels',
  typeName: 'Channel',
  schema,
  
  resolvers: getDefaultResolvers('Channels'),
  mutations: getDefaultMutations('Channels'),

});

//set up some permissions
const membersActions = [
  'channels.new',
  'channels.edit.own',
  'channels.remove.own',
];

Users.groups.members.can(membersActions);

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