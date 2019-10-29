import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js.js';

const files = createCollection({
  collectionName: 'files',
  typeName: 'file',
  schema,
  
  resolvers: getDefaultResolvers('files'),
  mutations: getDefaultMutations('files'),

});

//set up some permissions
const membersActions = [
  'files.new',
  'files.edit.own',
  'files.remove.own',
];

Users.groups.members.can(membersActions);

files.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

files.addView('byPlanetId', terms => ({
  selector: {
    planetId: terms.planetId
  }
}));

export default files;